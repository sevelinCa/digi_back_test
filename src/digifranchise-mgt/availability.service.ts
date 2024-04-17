import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { AvailabilityWeekDays, AvailabilityDayTime, Availability, type AllowedTimeSlotUnits, type BreakTimeBetweenBookedSlots } from './entities/availability.entity';
import { AvailabilityDto } from './dto/availability.dto';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class AvailabilityService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(DigifranchiseOwner)
        private readonly ownedFranchiseRepository: Repository<DigifranchiseOwner>,
        @InjectRepository(AvailabilityWeekDays)
        private readonly availabilityWeekDaysRepository: Repository<AvailabilityWeekDays>,
        @InjectRepository(AvailabilityDayTime)
        private readonly availabilityDayTimeRepository: Repository<AvailabilityDayTime>,
        @InjectRepository(Availability)
        private readonly availabilityRepository: Repository<Availability>,
    ) { }



    async createNewAvailability(availabilityDto: AvailabilityDto, ownedFranchiseId: string) {
        const owned = await this.ownedFranchiseRepository.findOne({ where: { id: ownedFranchiseId } });
        if (!owned) {
            throw new Error('Owned franchise not exist')
        }

        const newAvailability = this.availabilityRepository.create({
            ownedDigifranchise: owned,
            allowedTimeSlotUnits: availabilityDto.allowedTimeSlotUnits,
            breakTimeBetweenBookedSlots: availabilityDto.breakTimeBetweenBookedSlots,
            allowBookingOnPublicHolidays: availabilityDto.allowBookingOnPublicHolidays,
        });

        const savedAvailability = await this.availabilityRepository.save(newAvailability);

        if (availabilityDto.availabilityWeekDays && availabilityDto.availabilityWeekDays.length > 0) {
            const weekDaysPromises = availabilityDto.availabilityWeekDays.map(async (weekDayDto) => {
                const newWeekDay = this.availabilityWeekDaysRepository.create({
                    day: weekDayDto.day,
                    isDayFullBooked: weekDayDto.isDayFullBooked || false,
                    ownedDigifranchise: owned,
                });

                const savedWeekDay = await this.availabilityWeekDaysRepository.save(newWeekDay);

                if (!weekDayDto.availabilityDayTime || weekDayDto.availabilityDayTime.length === 0) {
                    throw new Error('Availability day time is not defined or empty');
                }

                let totalAvailableTimeSlots = 0;

                const dayTimePromises = weekDayDto.availabilityDayTime.map(async (dayTimeDto) => {
                    const newDayTime = this.availabilityDayTimeRepository.create({
                        startTime: dayTimeDto.startTime,
                        endTime: dayTimeDto.endTime,
                        isBooked: dayTimeDto.isBooked || false,
                        ownedDigifranchise: owned,
                        weekDay: savedWeekDay,
                    });

                    const availableTimeSlots = this.calculateAvailableTimeSlots(dayTimeDto.startTime, dayTimeDto.endTime, availabilityDto.allowedTimeSlotUnits, availabilityDto.breakTimeBetweenBookedSlots);
                    newDayTime.availableTimeSlots = availableTimeSlots;
                    totalAvailableTimeSlots += availableTimeSlots.length;
                    return await this.availabilityDayTimeRepository.save(newDayTime);
                });
                await Promise.all(dayTimePromises);

                savedWeekDay.availabilityCounts = totalAvailableTimeSlots;
                await this.availabilityWeekDaysRepository.save(savedWeekDay);
                savedWeekDay.availability = [savedAvailability];
                return await this.availabilityWeekDaysRepository.save(savedWeekDay);
            });
            await Promise.all(weekDaysPromises);
        }

        return savedAvailability;
    }

    calculateAvailableTimeSlots(startTime: string, endTime: string, slotDuration: AllowedTimeSlotUnits, breakTime: BreakTimeBetweenBookedSlots): string[] {
        const startDate = new Date(`2024-01-01T${startTime}`);
        const endDate = new Date(`2024-01-01T${endTime}`);

        const durationInMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);

        const timeSlotDuration = slotDuration;
        const breakTimeDuration = breakTime;
        const numberOfSlots = Math.floor(durationInMinutes / (timeSlotDuration + breakTimeDuration));

        const availableTimeSlots: string[] = [];

        let currentTime = startDate;
        for (let i = 0; i < numberOfSlots; i++) {
            availableTimeSlots.push(currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            currentTime = new Date(currentTime.getTime() + timeSlotDuration * 60000);
            currentTime = new Date(currentTime.getTime() + breakTimeDuration * 60000);
        }

        return availableTimeSlots;
    }

    async getAvailableAvailability(ownedFranchiseId: string) {

        const owned = await this.ownedFranchiseRepository.findOne({ where: { id: ownedFranchiseId } });
        if (!owned) {
            throw new Error('Owned franchise not exist')
        }

        const availabilityWeekDays = await this.availabilityWeekDaysRepository.find({
            where: { ownedDigifranchise: Equal(owned.id) },
            relations: ['availability', 'dayTime']
        });

        const availableWeekDays = availabilityWeekDays.filter(weekDay => weekDay.availabilityCounts > 0);

        const availableAvailability = await Promise.all(availableWeekDays.map(async (weekDay) => {
            const availableDayTime = await this.availabilityDayTimeRepository.find({
                where: { weekDay: Equal(weekDay.id), ownedDigifranchise: Equal(owned.id) },
                relations: ['weekDay']
            });

            const availableDayTimes = availableDayTime.filter(dayTime => !dayTime.isBooked);

            return {
                ...weekDay,
                availabilityDayTime: availableDayTimes
            };
        }));

        return availableAvailability;
    }

}



