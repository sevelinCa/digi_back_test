import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Equal, IsNull, Repository, type DeepPartial } from 'typeorm';
import {
    AvailabilityWeekDays, AvailabilityDayTime, Availability,
    AllowedTimeSlotUnits, BreakTimeBetweenBookedSlots, AvailabilitySlotsDetails,
    AvailabilityBookedSlots,
    Unavailability
} from './entities/availability.entity';
import { AvailabilityDto } from './dto/availability.dto';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { startOfDay, endOfDay } from 'date-fns';
import { HttpStatus } from '@nestjs/common';


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
        private readonly UnavailabilityRepository: Repository<Unavailability>,

    
    ) { }


    async createNewAvailability(availabilityDto: AvailabilityDto, ownedFranchiseId: string) {
        const existingAvailability = await this.availabilityRepository.findOne({ where: { ownedDigifranchise: Equal(ownedFranchiseId) } });
        if (existingAvailability) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: 'The provided ownedFranchiseId has been used to create availability before.',
            };
        }
     
        const owned = await this.ownedFranchiseRepository.findOne({ where: { id: ownedFranchiseId } });
        if (!owned) {
            throw new Error('Owned franchise does not exist');
        }
    
        const savedAvailabilities: Availability[] = [];
        const savedUnavailabilities: Unavailability[] = [];
    
        const currentDate = new Date();
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        if (availabilityDto.availabilityWeekDays && availabilityDto.availabilityWeekDays.length > 0) {
            for (let day = 1; day <= daysInMonth; day++) {
                const currentDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toLocaleDateString('en-US', { weekday: 'long' });
    
                const matchingDayOfWeek = availabilityDto.availabilityWeekDays.find(dayDto => dayDto.day === currentDayOfWeek);
                if (matchingDayOfWeek) {
                    const newAvailability = this.availabilityRepository.create({
                        ownedDigifranchise: owned,
                        allowedTimeSlotUnits: availabilityDto.allowedTimeSlotUnits,
                        breakTimeBetweenBookedSlots: availabilityDto.breakTimeBetweenBookedSlots,
                        allowBookingOnPublicHolidays: availabilityDto.allowBookingOnPublicHolidays,
                    });
    
                    const savedAvailability = await this.availabilityRepository.save(newAvailability);
                    savedAvailabilities.push(savedAvailability);
    
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
                                    day: currentDayOfWeek,
                                    workingDate: savedWeekDay.workingDate,
                                });
    
                                await this.availabilitySlotsDetailsRepository.save(newAvailabilitySlot);
                                totalAvailableTimeSlots++;
                            }
                        }
    
                        savedWeekDay.availabilityCounts = totalAvailableTimeSlots;
                        savedWeekDay.availability = [savedAvailability];
                        await this.availabilityWeekDaysRepository.save(savedWeekDay);
                    }
                }
                
                if (availabilityDto.unavailability && availabilityDto.unavailability.length > 0) {
                    for (const unavailabilityDto of availabilityDto.unavailability) {
                        const newUnavailability = this.UnavailabilityRepository.create({
                            ownedDigifranchise: owned,
                            startTime: unavailabilityDto.startTime,
                            endTime: unavailabilityDto.endTime,
                            workingDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
                        });
                        const savedUnavailability = await this.UnavailabilityRepository.save(newUnavailability);
                        savedUnavailabilities.push(savedUnavailability);
                    }
                }
            }
        }
    
        return { savedAvailabilities, savedUnavailabilities };
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

    async bookSlotDetail(slotId: string, ownedFranchiseId: string): Promise<AvailabilitySlotsDetails> {
    
        const owned = await this.ownedFranchiseRepository.findOne({
            where:{id: ownedFranchiseId}
        })
        if(!owned){
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
    
    
}



