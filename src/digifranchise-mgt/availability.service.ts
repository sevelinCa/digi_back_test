import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Equal, Repository, getConnection, getRepository } from 'typeorm';
import {
    AvailabilityWeekDays,
    AvailabilityDayTime,
    Availability,
    AllowedTimeSlotUnits,
    BreakTimeBetweenBookedSlots,
    AvailabilitySlotsDetails,
    AvailabilityBookedSlots,
    Unavailability,
    AvailabilitySlotsTimeOneOne,
} from './entities/availability.entity';
import {
    AvailabilityDto,
    UnavailabilityDto,
    AvailabilityDayTimeDto,
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
        @InjectRepository(AvailabilitySlotsTimeOneOne)
        private readonly availabilitySlotsTimeOneOneRepository: Repository<AvailabilitySlotsTimeOneOne>
    ) {
        schedule.scheduleJob('0 0 * * *', this.deleteSlotsAtEndOfDay.bind(this));
    }
    private convertTo24HourFormat(time: string): string {
        if (!time.includes(' ')) {
            throw new Error('Invalid time format. Expected format is "HH:MM AM/PM".');
        }
    
        const [timeString, period] = time.split(' ');
        let [hours, minutes] = timeString.split(':');
    
        if (isNaN(parseInt(hours, 10)) || isNaN(parseInt(minutes, 10))) {
            throw new Error('Invalid time format. Hours and minutes must be numbers.');
        }
    
        if (period.toLowerCase() === 'pm' && hours !== '12') {
            hours = (parseInt(hours, 10) + 12).toString();
        } else if (period.toLowerCase() === 'am' && hours === '12') {
            hours = '00';
        }
    
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
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
                const workingDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

                const dayPromises: Promise<any>[] = [];

                if (availabilityDto.availabilityWeekDays) {
                    const matchingDayOfWeek = availabilityDto.availabilityWeekDays.find(dayDto => dayDto.day === currentDayOfWeek);
                    if (matchingDayOfWeek) {
                        const newAvailability = await this.createAvailability(owned, availabilityDto);
                        savedAvailabilities.push(newAvailability);

                        if (matchingDayOfWeek.availabilityDayTime && matchingDayOfWeek.availabilityDayTime.length > 0) {
                            const savedWeekDay = await this.createAvailabilityWeekDay(owned, currentDayOfWeek, day);

                            const availabilityPromises: Promise<AvailabilitySlotsTimeOneOne[]>[] = matchingDayOfWeek.availabilityDayTime.map(async (dayTimeDto) => {
                                const savedDayTime = await this.createAvailabilityDayTime(owned, savedWeekDay, dayTimeDto, availabilityDto, currentDayOfWeek);

                                const availabilityId = newAvailability.id;
                                const slotPromise = this.createAvailabilitySlotsTimeOneOne(
                                    owned,
                                    savedDayTime,
                                    savedWeekDay,
                                    { startTime: dayTimeDto.startTime, endTime: dayTimeDto.endTime },
                                    currentDayOfWeek,
                                    availabilityDto.allowedTimeSlotUnits,
                                    availabilityDto.breakTimeBetweenBookedSlots,
                                    availabilityId,
                                    workingDate
                                );
                                return slotPromise;
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

    async updateAvailabilitySlotsTimeOneOne(updateAvailabilityDto: any, slotId: string): Promise<any> {
        try {
            const slot = await this.availabilitySlotsTimeOneOneRepository.findOne({ where: { id: slotId } });

            if (!slot) {
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Availability slot not found.',
                };
            }

            const startTime = updateAvailabilityDto.startTime;
            const endTime = updateAvailabilityDto.endTime;
            const slotDuration = updateAvailabilityDto.allowedTimeSlotUnits;
            const breakTime = updateAvailabilityDto.breakTimeBetweenBookedSlots;
            const slots = this.calculateAvailableTimeSlots(
                startTime,
                endTime,
                slotDuration,
                breakTime
            );

            await this.availabilitySlotsTimeOneOneRepository.update(
                { id: slotId },
                {
                    startTime: startTime,
                    endTime: endTime,
                    singleAvailabilityTimeSlots: slots,
                }
            );

            return {
                statusCode: HttpStatus.OK,
                message: 'Availability slot updated successfully.',
            };
        } catch (error) {
            console.error('Error updating availability slot:', error);
            throw error;
        }
    }


    async createAvailabilitySlotsTimeOneOne(
        owned: DigifranchiseOwner,
        savedDayTime: AvailabilityDayTime,
        savedWeekDay: AvailabilityWeekDays,
        slot: { startTime: string; endTime: string },
        currentDayOfWeek: string,
        allowedTimeSlotUnits: AllowedTimeSlotUnits,
        breakTimeBetweenBookedSlots: BreakTimeBetweenBookedSlots,
        availabilityId: string,
        workingDate: Date
    ): Promise<AvailabilitySlotsTimeOneOne[]> {
        try {
            const availability = await this.availabilityRepository.findOneOrFail({ where: { id: availabilityId } });

            const slots = this.calculateAvailableTimeSlots(slot.startTime, slot.endTime, allowedTimeSlotUnits, breakTimeBetweenBookedSlots);

            const newAvailabilitySlots = slots.map(singleSlot => {
                // Use the convertTo24HourFormat function here
                const startTime24Hour = this.convertTo24HourFormat(singleSlot.startTime);
                const endTime24Hour = this.convertTo24HourFormat(singleSlot.endTime);

                const newAvailabilitySlot = this.availabilitySlotsTimeOneOneRepository.create({
                    availabilityDayTime: savedDayTime,
                    availabilityWeekDays: savedWeekDay,
                    ownedDigifranchise: owned,
                    isSlotBooked: false,
                    startTime: startTime24Hour,
                    endTime: endTime24Hour,
                    singleAvailabilityTimeSlots: [{
                        startTime: startTime24Hour,
                        endTime: endTime24Hour
                    }],
                    day: currentDayOfWeek,
                    availability: availability,
                    workingDate: workingDate
                });

                return this.availabilitySlotsTimeOneOneRepository.save(newAvailabilitySlot);
            });

            return Promise.all(newAvailabilitySlots);

        } catch (error) {
            console.error('Error creating AvailabilitySlotsTimeOneOne:', error);
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

            const availabilityId = savedDayTime.availability.id;

            const slotDetails = await this.createAvailabilitySlotDetails(
                owned,
                savedDayTime,
                savedWeekDay,
                { startTime: dayTimeDto.startTime, endTime: dayTimeDto.endTime },
                currentDayOfWeek,
                availabilityDto.allowedTimeSlotUnits,

                availabilityDto.breakTimeBetweenBookedSlots,
                availabilityId,


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
        breakTimeBetweenBookedSlots: BreakTimeBetweenBookedSlots,
        availabilityId: string
    ): Promise<AvailabilitySlotsDetails> {
        try {
            const availableTimeSlots = this.calculateAvailableTimeSlots(
                slot.startTime,
                slot.endTime,
                allowedTimeSlotUnits,
                breakTimeBetweenBookedSlots
            );


            const availability = await this.availabilityRepository.findOne({ where: { id: availabilityId } });
            if (!availability) {
                throw new Error('Availability not found');
            }

            const newAvailabilitySlot = this.availabilitySlotsDetailsRepository.create({
                availabilityDayTime: savedDayTime,
                availabilityWeekDays: savedWeekDay,
                ownedDigifranchise: owned,
                isSlotBooked: false,
                availabilityTimeSlotsDetails: availableTimeSlots,
                day: currentDayOfWeek,
                workingDate: savedWeekDay.workingDate,
                startTime: savedDayTime.startTime,
                endTime: savedDayTime.endTime,
                availability: availability
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

            const newUnavailability = this.unavailabilityRepository.create({
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

            return this.unavailabilityRepository.save(newUnavailability);
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

    async getAvailabilitySlotsByDateAndFranchise(date: Date, ownerFranchiseId: string): Promise<AvailabilitySlotsTimeOneOne[]> {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const slots = await this.availabilitySlotsTimeOneOneRepository.find({
            where: {
                ownedDigifranchise: Equal(ownerFranchiseId),
                workingDate: Between(startOfDay, endOfDay),
                isSlotBooked: false
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

            const slots = await this.availabilitySlotsTimeOneOneRepository.find({
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

    async bookSlotDetail(slotId: string, ownedFranchiseId: string): Promise<AvailabilitySlotsTimeOneOne> {

        const owned = await this.ownedFranchiseRepository.findOne({
            where: { id: ownedFranchiseId }
        })
        if (!owned) {
            throw new Error('Franchise owner not found')
        }
        console.log("======/", owned);
        const slot = await this.availabilitySlotsTimeOneOneRepository.findOne({
            where: {
                id: slotId,
                ownedDigifranchise: Equal(ownedFranchiseId)
            }
        });

        console.log("=====/", slot)
        if (!slot) {
            throw new Error('Slot not found or does not belong to the specified franchise');
        }

        slot.isSlotBooked = !slot.isSlotBooked;

        const updatedSlot = await this.availabilitySlotsTimeOneOneRepository.save(slot);

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
            const slots = this.calculateAvailableTimeSlots(
                startTime,
                endTime,
                slotDuration,
                breakTime
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
            relations: ['availability'],
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

    async getAvailableSlotsInDay(ownerFranchiseId: string) {
        const owned = await this.ownedFranchiseRepository.findOne({ where: { id: ownerFranchiseId } });
        if (!owned) {
            throw new Error('Franchise manager not found');
        }

        const allAvailabilitySlots = await this.availabilitySlotsTimeOneOneRepository.find({
            where: {
                ownedDigifranchise: Equal(owned.id),
                isSlotBooked: false
            },
            relations: ['availability', 'availability.unavailabilities'],
        });

        return allAvailabilitySlots

    }

    async deleteAvailability(ownedFranchiseId: string): Promise<void> {

        const owned = await this.ownedFranchiseRepository.findOne({
            where: { id: ownedFranchiseId }
        })
        if (!owned) {
            throw new Error('Franchise owner not found')
        }
        const availability = await this.availabilityRepository.findOne({
            where: { ownedDigifranchise: Equal(owned.id) },
            relations: ['weekDays', 'dayTime', 'slotDetails', 'unavailabilities',],
        });

        if (!availability) {
            throw new Error('Availability not found');
        }

        await this.availabilityWeekDaysRepository.remove(availability.weekDays);

        await this.availabilityDayTimeRepository.remove(availability.dayTime);

        await this.availabilitySlotsDetailsRepository.remove(availability.slotDetails);

        await this.unavailabilityRepository.remove(availability.unavailabilities);


        await this.availabilityRepository.remove(availability);
    }

}
