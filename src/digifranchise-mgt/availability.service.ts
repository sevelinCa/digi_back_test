import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Equal, IsNull, Repository, type DeepPartial } from 'typeorm';
import { AvailabilityWeekDays, AvailabilityDayTime, Availability, AllowedTimeSlotUnits, BreakTimeBetweenBookedSlots, AvailabilitySlotsDetails } from './entities/availability.entity';
import { AvailabilityDto } from './dto/availability.dto';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';

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
        private readonly availabilitySlotsDetailsRepository: Repository<AvailabilitySlotsDetails>
    ) { }


    async createNewAvailability(availabilityDto: AvailabilityDto, ownedFranchiseId: string) {
        const owned = await this.ownedFranchiseRepository.findOne({ where: { id: ownedFranchiseId } });
        if (!owned) {
            throw new Error('Owned franchise does not exist');
        }
    
        const savedAvailabilities: Availability[] = [];
    
        // Assuming the current date is the start of the month
        const currentDate = new Date();
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    
        // Check if availabilityWeekDays is defined before iterating
        if (availabilityDto.availabilityWeekDays && availabilityDto.availabilityWeekDays.length > 0) {
            for (let day = 1; day <= daysInMonth; day++) {
                const currentDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toLocaleDateString('en-US', { weekday: 'long' });
    
                const matchingDayOfWeek = availabilityDto.availabilityWeekDays.find(dayDto => dayDto.day === currentDayOfWeek);
                if (matchingDayOfWeek) {
                    // Creating availability for the day
                    const newAvailability = this.availabilityRepository.create({
                        ownedDigifranchise: owned,
                        allowedTimeSlotUnits: availabilityDto.allowedTimeSlotUnits,
                        breakTimeBetweenBookedSlots: availabilityDto.breakTimeBetweenBookedSlots,
                        allowBookingOnPublicHolidays: availabilityDto.allowBookingOnPublicHolidays,
                    });
    
                    const savedAvailability = await this.availabilityRepository.save(newAvailability);
                    savedAvailabilities.push(savedAvailability);
    
                    // Apply day-specific availability settings
                    if (matchingDayOfWeek.availabilityDayTime && matchingDayOfWeek.availabilityDayTime.length > 0) {
                        const weekDay = this.availabilityWeekDaysRepository.create({
                            day: currentDayOfWeek,
                            isDayFullBooked: matchingDayOfWeek.isDayFullBooked || false,
                            ownedDigifranchise: owned,
                            workingDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), day), 
                        });
    
                        const savedWeekDay = await this.availabilityWeekDaysRepository.save(weekDay);
    
                        let totalAvailableTimeSlots = 0;
    
                        for (const dayTimeDto of matchingDayOfWeek.availabilityDayTime) {
                            const newDayTime = this.availabilityDayTimeRepository.create({
                                startTime: dayTimeDto.startTime,
                                endTime: dayTimeDto.endTime,
                                isBooked: dayTimeDto.isBooked || false,
                                ownedDigifranchise: owned,
                                weekDay: savedWeekDay,
                            });
    
                            const savedDayTime = await this.availabilityDayTimeRepository.save(newDayTime);
    
                            const availableTimeSlots = this.calculateAvailableTimeSlots(dayTimeDto.startTime, dayTimeDto.endTime, availabilityDto.allowedTimeSlotUnits, availabilityDto.breakTimeBetweenBookedSlots);
    
                            for (const slot of availableTimeSlots) {
                                const newAvailabilitySlot = this.availabilitySlotsDetailsRepository.create({
                                    availabilityDayTime: savedDayTime,
                                    availabilityWeekDays: savedWeekDay,
                                    ownedDigifranchise: owned,
                                    isSlotBooked: false,
                                    availabilityTimeSlotsDetails: [{ startTime: slot.startTime, endTime: slot.endTime }],
                                });
    
                                await this.availabilitySlotsDetailsRepository.save(newAvailabilitySlot);
                                totalAvailableTimeSlots++;
                            }
                        }
    
                        savedWeekDay.availabilityCounts = totalAvailableTimeSlots;
                        savedWeekDay.availability = [savedAvailability];
                        await this.availabilityWeekDaysRepository.save(savedWeekDay);
    
                        if (savedWeekDay.workingDate) {
                            await this.deleteSlotsAtEndOfDay(savedWeekDay.workingDate); 
                        } 
                    }
                }
            }
        }
    
        return savedAvailabilities;
    }
    
    
    calculateAvailableTimeSlots(startTime: string, endTime: string, slotDuration: AllowedTimeSlotUnits, breakTime: BreakTimeBetweenBookedSlots): { startTime: string, endTime: string }[] {
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

    async deleteSlotsAtEndOfDay(workingDate: Date) {
        const startOfDay = new Date(workingDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(workingDate);
        endOfDay.setHours(23, 59, 59, 999);
    
        const slotsToDelete = await this.availabilitySlotsDetailsRepository.find({
            where: {
                createdAt: Between(startOfDay, endOfDay),
            },
        });
    
        for (const slot of slotsToDelete) {
            await this.availabilitySlotsDetailsRepository.delete(slot.id);
        }
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

    async getAvailabilityByOwnedFranchiseId(availabilityId: string): Promise<Availability | null> {
        return this.availabilityRepository.findOne({ where: { id: availabilityId } });
    }

    async deleteAvailabilityByOwnedFranchiseId(availabilityId: string): Promise<void> {
        await this.availabilityRepository.delete({ id: availabilityId, deleteAt: IsNull() });
     }



    async updateAvailability(availabilityId: string, updateAvailabilityDto: UpdateAvailabilityDto): Promise<Availability> {
        
        const availability = await this.availabilityRepository.findOne({where:{id: Equal(availabilityId)}});
        if (!availability) {
            throw new Error('Availability not found');
        }


        
        availability.allowedTimeSlotUnits = updateAvailabilityDto.allowedTimeSlotUnits ?? AllowedTimeSlotUnits.THIRTY_MINUTES;

        availability.breakTimeBetweenBookedSlots = updateAvailabilityDto.breakTimeBetweenBookedSlots ?? BreakTimeBetweenBookedSlots.FIFTEEN_MINUTES;
        availability.allowBookingOnPublicHolidays = updateAvailabilityDto.allowBookingOnPublicHolidays ?? false;
        
        const updatedAvailability = await this.availabilityRepository.save(availability);

        
        if (updateAvailabilityDto.availabilityWeekDays) {
            for (const weekDayDto of updateAvailabilityDto.availabilityWeekDays) {
                
                let weekDay = await this.availabilityWeekDaysRepository.findOne({ where: { day: weekDayDto.day, availability: availability } });
                if (!weekDay) {
                    weekDay = this.availabilityWeekDaysRepository.create({
                        
                        day: weekDayDto.day,
                        isDayFullBooked: weekDayDto.isDayFullBooked,
                        
                        availability: [updatedAvailability],
                    });
                } else {
                    weekDay.isDayFullBooked = weekDayDto.isDayFullBooked || false;
                    
                    weekDay.availability = [updatedAvailability];
                }

                
                await this.availabilityWeekDaysRepository.save(weekDay);

                
                if (weekDayDto.availabilityDayTime) {
                    for (const dayTimeDto of weekDayDto.availabilityDayTime) {
                        
                        let dayTime = await this.availabilityDayTimeRepository.findOne({ where: { startTime: dayTimeDto.startTime, endTime: dayTimeDto.endTime, weekDay: weekDay } });
                        if (!dayTime) {
                            dayTime = this.availabilityDayTimeRepository.create({
                                startTime: dayTimeDto.startTime,
                                endTime: dayTimeDto.endTime,
                                isBooked: dayTimeDto.isBooked,
                                weekDay: weekDay,
                            });
                        } else {
                            dayTime.isBooked = dayTimeDto.isBooked || false;
                        }

                        
                        await this.availabilityDayTimeRepository.save(dayTime);
                    }
                }
            }
        }

        return updatedAvailability;
    }


}



