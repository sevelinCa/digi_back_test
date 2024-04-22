import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Equal, In, Repository } from 'typeorm';
import {
    AvailabilityWeekDays, AvailabilityDayTime, Availability,
    AllowedTimeSlotUnits, BreakTimeBetweenBookedSlots, AvailabilitySlotsDetails,
    AvailabilityBookedSlots,
    Unavailability
} from './entities/availability.entity';
import { AvailabilityDto, UnavailabilityDto, AvailabilityDayTimeDto } from './dto/availability.dto';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
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
        private readonly UnavailabilityRepository: Repository<Unavailability>,
    ) {
        schedule.scheduleJob('0 0 * * *', this.deleteSlotsAtEndOfDay.bind(this))
    }

    async createNewAvailability(availabilityDto: AvailabilityDto, ownedFranchiseId: string) {
        try {
            const existingAvailability = await this.availabilityRepository.findOne({ where: { ownedDigifranchise: Equal(ownedFranchiseId) } });
            if (existingAvailability) {
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'The provided ownedFranchiseId has been used to create availability before.',
                };
            }

            const owned = await this.ownedFranchiseRepository.findOneOrFail({ where: { id: ownedFranchiseId } });

            const currentDate = new Date();
            const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

            const savedAvailabilities: Availability[] = [];
            const savedUnavailabilities: Unavailability[] = [];

            const promises: Promise<any>[] = [];
            let currentDayOfWeek: string;

            for (let day = 1; day <= daysInMonth; day++) {
                const currentDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toLocaleDateString('en-US', { weekday: 'long' });

                const dayPromises: Promise<any>[] = [];

                if (availabilityDto.availabilityWeekDays) {
                    const matchingDayOfWeek = availabilityDto.availabilityWeekDays.find(dayDto => dayDto.day === currentDayOfWeek);
                    if (matchingDayOfWeek) {
                        const newAvailability = await this.createAvailability(owned, availabilityDto);
                        savedAvailabilities.push(newAvailability);

                        if (matchingDayOfWeek.availabilityDayTime && matchingDayOfWeek.availabilityDayTime.length > 0) {
                            const savedWeekDay = await this.createAvailabilityWeekDay(owned, currentDayOfWeek, day);

                            const availabilityPromises: Promise<AvailabilityDayTime>[] = matchingDayOfWeek.availabilityDayTime.map(dayTimeDto => {
                                return this.createAvailabilityDayTime(owned, savedWeekDay, dayTimeDto, availabilityDto, currentDayOfWeek);
                            });

                            dayPromises.push(...availabilityPromises);
                        }
                    }
                }
                if (availabilityDto.unavailability && availabilityDto.unavailability.length > 0) {
                    const unavailabilityPromises: Promise<Unavailability>[] = availabilityDto.unavailability.map(unavailabilityDto => {
                        return this.createUnavailability(owned, unavailabilityDto, day, currentDate);
                    });

                    dayPromises.push(...unavailabilityPromises);
                }

                promises.push(...dayPromises);
            }

            await Promise.all(promises);

            return { savedAvailabilities, savedUnavailabilities };
        } catch (error) {

            console.error(error);
            throw error;
        }
    }

    private async createAvailability(owned: DigifranchiseOwner, availabilityDto: AvailabilityDto): Promise<Availability> {
        const newAvailability = this.availabilityRepository.create({
            ownedDigifranchise: owned,
            allowedTimeSlotUnits: availabilityDto.allowedTimeSlotUnits,
            breakTimeBetweenBookedSlots: availabilityDto.breakTimeBetweenBookedSlots,
            allowBookingOnPublicHolidays: availabilityDto.allowBookingOnPublicHolidays,
        });

        return this.availabilityRepository.save(newAvailability);
    }

    private async createAvailabilityWeekDay(owned: DigifranchiseOwner, currentDayOfWeek: string, day: number): Promise<AvailabilityWeekDays> {
        const currentDate = new Date();

        const weekDay = this.availabilityWeekDaysRepository.create({
            day: currentDayOfWeek,
            ownedDigifranchise: owned,
            workingDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
        });

        return this.availabilityWeekDaysRepository.save(weekDay);
    }

    private async createAvailabilityDayTime(
        owned: DigifranchiseOwner,
        savedWeekDay: AvailabilityWeekDays,
        dayTimeDto: AvailabilityDayTimeDto,
        availabilityDto: AvailabilityDto,
        currentDayOfWeek: string
    ): Promise<AvailabilityDayTime> {
        try {
            const availabilityDayTime = this.availabilityDayTimeRepository.create({
                startTime: dayTimeDto.startTime,
                endTime: dayTimeDto.endTime,
                isBooked: dayTimeDto.isBooked || false,
                ownedDigifranchise: owned,
                weekDay: savedWeekDay,
            });


            let availability = await this.availabilityRepository.findOne({ where: { ownedDigifranchise: owned } });
            if (!availability) {
                availability = await this.createAvailability(owned, availabilityDto);
            }
            availabilityDayTime.availability = availability;


            const savedDayTime = await this.availabilityDayTimeRepository.save(availabilityDayTime);


            const slotDetails = await this.createAvailabilitySlotDetails(
                owned,
                savedDayTime,
                savedWeekDay,
                { startTime: dayTimeDto.startTime, endTime: dayTimeDto.endTime },
                currentDayOfWeek,
                availabilityDto.allowedTimeSlotUnits,

                availabilityDto.breakTimeBetweenBookedSlots


            );

            return savedDayTime;
        } catch (error) {
            console.error('Error creating AvailabilityDayTime:', error);
            throw error;
        }
    }

    private async createAvailabilitySlotDetails(
        owned: DigifranchiseOwner,
        savedDayTime: AvailabilityDayTime,
        savedWeekDay: AvailabilityWeekDays,
        slot: { startTime: string, endTime: string },
        currentDayOfWeek: string,
        allowedTimeSlotUnits: AllowedTimeSlotUnits,
        breakTimeBetweenBookedSlots: BreakTimeBetweenBookedSlots

    ): Promise<AvailabilitySlotsDetails> {
        try {
            const availableTimeSlots = this.calculateAvailableTimeSlots(
                slot.startTime,
                slot.endTime,
                allowedTimeSlotUnits,
                breakTimeBetweenBookedSlots
            );

            const newAvailabilitySlot = this.availabilitySlotsDetailsRepository.create({
                availabilityDayTime: savedDayTime,
                availabilityWeekDays: savedWeekDay,
                ownedDigifranchise: owned,
                isSlotBooked: false,
                availabilityTimeSlotsDetails: availableTimeSlots,
                day: currentDayOfWeek,
                workingDate: savedWeekDay.workingDate,
                startTime: savedDayTime.startTime,
                endTime: savedDayTime.endTime

            });

            const savedAvailabilitySlot = await this.availabilitySlotsDetailsRepository.save(newAvailabilitySlot);

            savedWeekDay.availabilityCounts += 1;
            await this.availabilityWeekDaysRepository.save(savedWeekDay);

            return savedAvailabilitySlot;
        } catch (error) {
            console.error('Error creating AvailabilitySlotsDetails:', error);
            throw error;
        }
    }

    private async deleteAvailabilitySlotDetails(
        slotId: string,
        savedWeekDay: AvailabilityWeekDays
    ): Promise<void> {
        await this.availabilitySlotsDetailsRepository.delete(slotId);

        savedWeekDay.availabilityCounts -= 1;
        await this.availabilityWeekDaysRepository.save(savedWeekDay);
    }

    private async createUnavailability(
        owned: DigifranchiseOwner,
        unavailabilityDto: UnavailabilityDto,
        day: number,
        currentDate: Date
    ): Promise<Unavailability> {
        try {

            const newUnavailability = this.UnavailabilityRepository.create({
                ownedDigifranchise: owned,
                startTime: unavailabilityDto.startTime,
                endTime: unavailabilityDto.endTime,
                workingDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
            });

            const availability = await this.availabilityRepository.findOne({ where: { ownedDigifranchise: Equal(owned.id) } });

            if (availability) {
                newUnavailability.availability = availability;
            } else {
                console.error('Related Availability not found for Unavailability.');
            }

            const availabilityWeekDays = await this.availabilityWeekDaysRepository.findOne({ where: { workingDate: newUnavailability.workingDate } });
            if (availabilityWeekDays) {
                newUnavailability.availabilityWeekDays = availabilityWeekDays;
            } else {
                console.error('AvailabilityWeekDays not found for Unavailability.');
            }

            return this.UnavailabilityRepository.save(newUnavailability);
        } catch (error) {
            console.error('Error creating Unavailability:', error);
            throw error;
        }
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

    private async deleteSlotsAtEndOfDay() {
        try {
            const currentDate = new Date();


            const daysAgo = 1;
            const startOfDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - daysAgo);


            const endOfDay = new Date(currentDate);
            endOfDay.setHours(23, 59, 59, 999);

            const slotsToDelete = await this.availabilitySlotsDetailsRepository.find({
                where: {
                    workingDate: Between(startOfDay, endOfDay),
                },
            });

            for (const slot of slotsToDelete) {
                if (slot.availabilityWeekDays !== null) {
                    await this.deleteAvailabilitySlotDetails(slot.id, slot.availabilityWeekDays);
                } else {
                    console.warn(`Skipping deletion for slot with ID ${slot.id} due to null availabilityWeekDays.`);
                }
            }
        } catch (error) {
            console.error('Error deleting slots:', error);
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

    async getAllSlotesInDayByDayAndFranchise(
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

    async updateAvailability(updateAvailabilityDto: UpdateAvailabilityDto, availabilityId: string) {
        try {

            const availability = await this.availabilityRepository.findOne({
                where: { id: availabilityId },
                relations: ['weekDays', 'weekDays.dayTimeSlots'],
            });


            if (!availability) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Availability not found.',
                };
            }


            if (updateAvailabilityDto.allowedTimeSlotUnits !== undefined) {
                availability.allowedTimeSlotUnits = updateAvailabilityDto.allowedTimeSlotUnits;
            }
            if (updateAvailabilityDto.breakTimeBetweenBookedSlots !== undefined) {
                availability.breakTimeBetweenBookedSlots = updateAvailabilityDto.breakTimeBetweenBookedSlots;
            }
            if (updateAvailabilityDto.allowBookingOnPublicHolidays !== undefined) {
                availability.allowBookingOnPublicHolidays = updateAvailabilityDto.allowBookingOnPublicHolidays;
            }


            await this.availabilityRepository.save(availability);


            if (updateAvailabilityDto.availabilityWeekDays && availability.weekDays) {
                for (const updatedWeekDayDto of updateAvailabilityDto.availabilityWeekDays) {
                    const weekDay = availability.weekDays.find(day => day.day === updatedWeekDayDto.day);
                    if (weekDay) {

                        if (updatedWeekDayDto.isDayFullBooked !== undefined) {
                            weekDay.isDayFullBooked = updatedWeekDayDto.isDayFullBooked;
                        }

                        if (updatedWeekDayDto.availabilityDayTime && weekDay.dayTimeSlots) {
                            for (const updatedDayTimeDto of updatedWeekDayDto.availabilityDayTime) {
                                const dayTimeSlot = weekDay.dayTimeSlots.find(slot => slot.startTime === updatedDayTimeDto.startTime && slot.endTime === updatedDayTimeDto.endTime);
                                if (dayTimeSlot) {

                                    if (updatedDayTimeDto.isBooked !== undefined) {
                                        dayTimeSlot.isBooked = updatedDayTimeDto.isBooked;
                                        await this.availabilityDayTimeRepository.save(dayTimeSlot);
                                    }
                                }
                            }
                        }
                        await this.availabilityWeekDaysRepository.save(weekDay);
                    }
                }
            }

            return {
                statusCode: HttpStatus.OK,
                message: 'Availability updated successfully.',
                updatedAvailability: availability,
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
    
        const allSlots = await this.availabilitySlotsDetailsRepository.find({
            where: {
                ownedDigifranchise: Equal(owned.id),
            },
        });
    
        const uniqueDaysMap = new Map<string, any>();
        
        allSlots.forEach(slot => {
            const day = slot.day;
            if (!uniqueDaysMap.has(day)) {
                uniqueDaysMap.set(day, slot);
            }
        });
    
        const sortedUniqueDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        
        const slotsByUniqueDays = sortedUniqueDays.map(day => {
            const slot = uniqueDaysMap.get(day);
            return slot ? [slot] : [];
        });
    
        return slotsByUniqueDays;
    }
    

}



