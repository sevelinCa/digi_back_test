import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Equal, Repository } from 'typeorm';
import {
    AvailabilityWeekDays,
    AvailabilityDayTime,
    Availability,
    AllowedTimeSlotUnits,
    BreakTimeBetweenBookedSlots,
    AvailabilitySlotsDetails,
    AvailabilityBookedSlots,
    Unavailability,
} from './entities/availability.entity';
import {
    AvailabilityDto,
    UnavailabilityDto,
    AvailabilityDayTimeDto,
    type AvailabilityWeekDaysDto,
} from './dto/availability.dto';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { HttpStatus } from '@nestjs/common';
import * as schedule from 'node-schedule';

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
        @InjectRepository(AvailabilitySlotsDetails)
        private readonly availabilitySlotsDetailsRepository: Repository<AvailabilitySlotsDetails>,
        @InjectRepository(AvailabilityBookedSlots)
        private availabilityBookedSlotsRepository: Repository<AvailabilityBookedSlots>,
        @InjectRepository(Unavailability)
        private readonly unavailabilityRepository: Repository<Unavailability>,
        @InjectRepository(AvailabilityWeekDays)
        private readonly weekDaysRepository: Repository<AvailabilityWeekDays>,
        @InjectRepository(AvailabilityDayTime)
        private readonly dayTimeRepository: Repository<AvailabilityDayTime>,
    ) {
        // schedule.scheduleJob('0 0 * * *', this.deleteSlotsAtEndOfDay.bind(this));
    }

    async createAvailability(availabilityDto: AvailabilityDto, ownedFranchiseId: string): Promise<Availability> {
        const ownedFranchise = await this.ownedFranchiseRepository.findOne({ where: { id: ownedFranchiseId } });
        if (!ownedFranchise) {
            throw new Error('Franchise owner not found');
        }

        const existingAvailability = await this.availabilityRepository.findOne({ where: { ownedDigifranchise: Equal(ownedFranchiseId) } });
        if (existingAvailability) {
            throw new HttpException('The provided ownedFranchiseId has been used to create availability before.', HttpStatus.BAD_REQUEST);
        }

        const availability = this.availabilityRepository.create({
            ...availabilityDto,
            ownedDigifranchise: ownedFranchise,
        });
        await this.availabilityRepository.save(availability);

        if (availabilityDto.availabilityWeekDays) {
            for (const weekDayDto of availabilityDto.availabilityWeekDays) {
                const weekDay = this.weekDaysRepository.create(weekDayDto);
                weekDay.availability = availability;

                if (weekDayDto.availabilityDayTime) {
                    for (const dayTimeDto of weekDayDto.availabilityDayTime) {
                        const dayTime = this.dayTimeRepository.create(dayTimeDto);
                        dayTime.weekDay = weekDay;
                        await this.dayTimeRepository.save(dayTime);

                        weekDay.availabilityCounts = this.calculateAvailabilityCounts(dayTimeDto.startTime, dayTimeDto.endTime, availabilityDto.allowedTimeSlotUnits, availabilityDto.breakTimeBetweenBookedSlots);
                        const workingDate = new Date();
                        const slots = this.calculateSlots(dayTimeDto.startTime, dayTimeDto.endTime, availabilityDto.allowedTimeSlotUnits, availabilityDto.breakTimeBetweenBookedSlots, workingDate, weekDayDto.day);

                        const availabilitySlotsDetails = this.availabilitySlotsDetailsRepository.create({
                            availabilityDayTime: dayTime,
                            availabilityWeekDays: weekDay,
                            ownedDigifranchise: ownedFranchise,
                            availability: availability,
                            availabilityTimeSlotsDetails: slots,
                            isSlotBooked: false,
                            day: weekDayDto.day,
                            startTime: dayTimeDto.startTime,
                            endTime: dayTimeDto.endTime,
                            workingDate: workingDate,
                        });

                        await this.availabilitySlotsDetailsRepository.save(availabilitySlotsDetails);
                    }
                }
                await this.weekDaysRepository.save(weekDay);
            }
        }

        for (const unavailabilityDto of availabilityDto.unavailability) {
            const unavailability = this.unavailabilityRepository.create(unavailabilityDto);
            unavailability.availability = availability;
            await this.unavailabilityRepository.save(unavailability);
        }

        return availability;
    }

    private calculateAvailabilityCounts(startTime: string, endTime: string, slotDuration: AllowedTimeSlotUnits, breakTime: BreakTimeBetweenBookedSlots): number {
        const startDate = new Date(`2024-01-01T${startTime}`);
        const endDate = new Date(`2024-01-01T${endTime}`);

        const durationInMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
        const timeSlotDuration = slotDuration;
        const breakTimeDuration = breakTime;
        const numberOfSlots = Math.floor(durationInMinutes / (timeSlotDuration + breakTimeDuration));

        return numberOfSlots;
    }

    private calculateSlots(
        startTime: string,
        endTime: string,
        slotDuration: AllowedTimeSlotUnits,
        breakTime: BreakTimeBetweenBookedSlots,
        workingDate: Date, 
        day: string 
    ): { startTime: string, endTime: string }[] {
        const startDate = new Date(`2024-01-01T${startTime}`);
        const endDate = new Date(`2024-01-01T${endTime}`);
    
        const durationInMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
    
        const timeSlotDuration = slotDuration;
        const breakTimeDuration = breakTime;
        const numberOfSlots = Math.floor(durationInMinutes / (timeSlotDuration + breakTimeDuration));
    
        const availableTimeSlots: { startTime: string, endTime: string }[] = [];
    
        let currentTime = startDate;
        for (let i = 0; i < numberOfSlots; i++) {
            const slotStartTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            currentTime = new Date(currentTime.getTime() + timeSlotDuration * 60000);
            const slotEndTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            availableTimeSlots.push({ startTime: slotStartTime, endTime: slotEndTime });
            currentTime = new Date(currentTime.getTime() + breakTimeDuration * 60000);
        }
    
        return availableTimeSlots;
    }

    async getAvailabilitySlotsByDateAndFranchise(date: Date, ownerFranchiseId: string): Promise<AvailabilitySlotsDetails[]> {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const slots = await this.availabilitySlotsDetailsRepository.find({
            where: {
                ownedDigifranchise: Equal(ownerFranchiseId),
                workingDate: Between(startOfDay, endOfDay),
            },
            relations: ['availabilityDayTime', 'availabilityWeekDays'],
        });

        return slots;
    }

    async getAllSlotesInDateByDateAndFranchise(
        date: Date,
        ownerFranchiseId: string
    ): Promise<{ startTime: string; endTime: string }[]> {
        try {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const slots = await this.availabilitySlotsDetailsRepository.find({
                where: {
                    ownedDigifranchise: Equal(ownerFranchiseId),
                    workingDate: Between(startOfDay, endOfDay),
                },
                relations: ['availabilityDayTime'],
            });

            const availabilityTimeSlotsDetails = slots
                .map(slot => slot.availabilityDayTime)
                .filter(detail => detail !== null)
                .map(detail => {
                    if (detail) {
                        return { startTime: detail.startTime, endTime: detail.endTime };
                    } else {
                        return { startTime: '', endTime: '' };
                    }
                });

            return availabilityTimeSlotsDetails;
        } catch (error) {
            console.error('Error fetching availability time slots details:', error);
            throw error;
        }
    }

    async bookSlotDetail(slotId: string, ownedFranchiseId: string): Promise<AvailabilitySlotsDetails> {

        const owned = await this.ownedFranchiseRepository.findOne({
            where: { id: ownedFranchiseId }
        })
        if (!owned) {
            throw new Error('Franchise owner not found')
        }
        const slot = await this.availabilitySlotsDetailsRepository.findOne({
            where: {
                id: slotId,
                ownedDigifranchise: Equal(ownedFranchiseId)
            }
        });

        if (!slot) {
            throw new Error('Slot not found or does not belong to the specified franchise');
        }

        slot.isSlotBooked = !slot.isSlotBooked;

        const updatedSlot = await this.availabilitySlotsDetailsRepository.save(slot);

        return updatedSlot;
    }

    async getAllAvailabilitySlotsByAndFranchise(ownerFranchiseId: string): Promise<AvailabilitySlotsDetails[]> {
        const slots = await this.availabilitySlotsDetailsRepository.find({
            where: {
                ownedDigifranchise: Equal(ownerFranchiseId),
            },
            relations: ['availabilityDayTime', 'availabilityWeekDays'],
        });

        return slots;
    }

    async updateAvailability(updateAvailabilityDto: any, availabilityId: string) {
        try {
            const availability =
                await this.availabilitySlotsDetailsRepository.findOne({
                    where: { id: availabilityId },
                    relations: ['availabilityDayTime', 'availabilityWeekDays'],
                });

            if (!availability) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Availability not found.',
                };
            }
            const startTime =
                updateAvailabilityDto.availabilityWeekDays[0].availabilityDayTime[0]
                    .startTime;
            const endTime =
                updateAvailabilityDto.availabilityWeekDays[0].availabilityDayTime[0]
                    .endTime;
            const slotDuration = updateAvailabilityDto.allowedTimeSlotUnits;
            const breakTime = updateAvailabilityDto.breakTimeBetweenBookedSlots;
            const slots = this.calculateSlots(
                startTime,
                endTime,
                slotDuration,
                breakTime,
                new Date(), 
                updateAvailabilityDto.availabilityWeekDays[0].day 
            );
            await this.availabilityDayTimeRepository.update(
                { id: availability?.availabilityDayTime?.id },
                {
                    startTime: startTime,
                    endTime: endTime,
                }
            );
            const response = this.availabilityDayTimeRepository.findOne({
                where: { id: availability?.availabilityDayTime?.id },
                relations: ['availability'],
            });
            await this.availabilitySlotsDetailsRepository.update(
                { day: updateAvailabilityDto.availabilityWeekDays[0].day },
                {
                    startTime: startTime,
                    endTime: endTime,
                    availabilityTimeSlotsDetails: slots,
                }
            );
            if (response) {
                const avId = response.then((res) => res?.availability.id);
                await this.availabilityRepository.update(
                    { id: await avId },
                    {
                        allowedTimeSlotUnits: slotDuration,
                        breakTimeBetweenBookedSlots: breakTime,
                    }
                );
            }
            const newAvailability =
                await this.availabilitySlotsDetailsRepository.findOne({
                    where: { id: availabilityId },
                    relations: ['availabilityDayTime', 'availabilityWeekDays'],
                });
            return {
                statusCode: HttpStatus.OK,
                message: 'Availability updated successfully.',
                updatedAvailability: newAvailability,
            };
        } catch (error) {
            console.error('Error updating availability:', error);
            throw error;
        }
    }

    async getWorkingHoursRange(ownerFranchiseId: string) {
        const owned = await this.ownedFranchiseRepository.findOne({ where: { id: ownerFranchiseId } });
        if (!owned) {
            throw new Error('Franchise manager not found');
        }

        const allAvailabilitySlots = await this.availabilitySlotsDetailsRepository.find({
            where: {
                ownedDigifranchise: Equal(owned.id),
            },
            relations: ['availability', 'availability.unavailabilities'],
        });

        const allUnavailabilitySlots = await this.unavailabilityRepository.find({
            where: {
                ownedDigifranchise: Equal(owned.id),
            },
        });

        const allSlots = [...allAvailabilitySlots, ...allUnavailabilitySlots];

        const uniqueDaysMap = new Map<string, any>();

        allSlots.forEach(slot => {
            if ('day' in slot) {
                const day = slot.day;
                if (!uniqueDaysMap.has(day)) {
                    uniqueDaysMap.set(day, slot);
                }
            }
        });

        const sortedUniqueDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

        const slotsByUniqueDays = sortedUniqueDays.map(day => {
            const slot = uniqueDaysMap.get(day);
            return slot ? [slot] : [];
        });

        return slotsByUniqueDays;
    }

    async getUnavailbilityByFranchise(ownerFranchiseId: string): Promise<Unavailability[]> {
        const unvailbilities = await this.unavailabilityRepository.find({
            where: {
                ownedDigifranchise: Equal(ownerFranchiseId),
            },
        });

        return unvailbilities;
    }

}
