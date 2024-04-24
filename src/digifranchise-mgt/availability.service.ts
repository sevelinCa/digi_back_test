import { Injectable } from '@nestjs/common';
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
        const ownedFranchise = await this.ownedFranchiseRepository.findOne({where:{id: ownedFranchiseId}});
        if (!ownedFranchise) {
            throw new Error('Franchise owner not found');
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
    
                // Assuming availabilityDayTime is an array of objects with startTime and endTime
                if (weekDayDto.availabilityDayTime) {
                    for (const dayTimeDto of weekDayDto.availabilityDayTime) {
                        const dayTime = this.dayTimeRepository.create(dayTimeDto);
                        dayTime.weekDay = weekDay;
                        await this.dayTimeRepository.save(dayTime);
    
                        // Calculate and set availabilityCounts for each day
                        weekDay.availabilityCounts = this.calculateAvailabilityCounts(dayTimeDto.startTime, dayTimeDto.endTime, availabilityDto.allowedTimeSlotUnits, availabilityDto.breakTimeBetweenBookedSlots);
                    }
                }
    
                await this.weekDaysRepository.save(weekDay);
            }
        }
    
        // Create Unavailability entities and link them to the main Availability
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

}
