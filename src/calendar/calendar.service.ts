import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DigifranchiseWorkingHours } from './entities/digifranchise-working-hours.entity';
import { Between, LessThan, MoreThanOrEqual, Repository } from 'typeorm';
import { AvailabilityTimeSlots } from './entities/time-slots.entity';
import { SetWorkingHoursDto } from './dto/availability.dto';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';
import dayjs from 'dayjs';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Bookedtimeslots } from './entities/new-timeslots.entity';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(DigifranchiseOwner)
    private readonly digifranchiseOwnerRepository: Repository<DigifranchiseOwner>,
    @InjectRepository(DigifranchiseWorkingHours)
    private readonly digifranchiseWorkingHoursRepository: Repository<DigifranchiseWorkingHours>,
    @InjectRepository(AvailabilityTimeSlots)
    private readonly digifranchiseAvailableTimeSlotsRepository: Repository<AvailabilityTimeSlots>,
    @InjectRepository(Bookedtimeslots)
    private readonly digifranchiseBookedTimeslotRepository: Repository<Bookedtimeslots>,
    @InjectQueue('time-slots') private readonly timeSlotsQueue: Queue
  ) {}

  async createWorkingHoursForDigifranchise(
    setWorkingHoursDto: SetWorkingHoursDto,
    ownedDigifranchiseId: string
  ) {
    const getOwnedDigifranchise: DigifranchiseOwner | null =
      await this.digifranchiseOwnerRepository.findOne({
        where: { id: ownedDigifranchiseId },
      });
    const setWorkingHours =
      this.digifranchiseWorkingHoursRepository.create(setWorkingHoursDto);
    if (!getOwnedDigifranchise) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Owned Digifranchise does not exist',
        },
        HttpStatus.NOT_FOUND
      );
    }
    const isTimeSlotsExists =
      await this.digifranchiseWorkingHoursRepository.findOne({
        where: { ownedDigifranchise: { id: ownedDigifranchiseId } },
      });
    if (isTimeSlotsExists) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: 'Digifranchise timeslots has already been created',
        },
        HttpStatus.CONFLICT
      );
    }
    let workingDays: any = [];
    for (let i = 0; i < setWorkingHoursDto?.availabilityWeekDays!.length; i++) {
      const obj = {
        day: setWorkingHoursDto?.availabilityWeekDays![i]?.day,
        startTime:
          setWorkingHoursDto?.availabilityWeekDays![i]?.availabilityDayTime!
            .startTime,
        endTime:
          setWorkingHoursDto?.availabilityWeekDays![i]?.availabilityDayTime!
            .endTime,
      };
      workingDays.push(obj);
    }
    let consultations: any = [];
    for (let i = 0; i < setWorkingHoursDto?.freeConsultations!.length; i++) {
      const obj = {
        day: setWorkingHoursDto?.freeConsultations![i]?.day,
        startTime:
          setWorkingHoursDto?.freeConsultations![i]?.availabilityDayTime!
            .startTime,
        endTime:
          setWorkingHoursDto?.freeConsultations![i]?.availabilityDayTime!
            .endTime,
      };
      consultations.push(obj);
    }
    setWorkingHours.ownedDigifranchise = getOwnedDigifranchise;
    setWorkingHours.availabilityWeekDays = workingDays;
    setWorkingHours.freeConsulations=consultations;
    await this.digifranchiseWorkingHoursRepository.save(setWorkingHours);
    await this.timeSlotsQueue.add({
      ownedDigifranchiseId,
      setWorkingHours: setWorkingHoursDto,
    });
  }
  async getWorkingHours(ownedDigifranchiseId: string) {
    const getOwnedDigifranchise: DigifranchiseOwner | null =
      await this.digifranchiseOwnerRepository.findOne({
        where: { id: ownedDigifranchiseId },
      });
    if (!getOwnedDigifranchise) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Owned Digifranchise does not exist',
        },
        HttpStatus.NOT_FOUND
      );
    }
    const workingDays = await this.digifranchiseWorkingHoursRepository.findOne({
      where: { ownedDigifranchise: { id: ownedDigifranchiseId } },
      relations: ['ownedDigifranchise'],
    });
    return workingDays;
  }
  async getTimeSlots(ownedDigifranchiseId: string, workingDate: string) {
    const startOfDay = new Date(workingDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(workingDate);
    endOfDay.setHours(23, 59, 59, 999);
    const getOwnedDigifranchise: DigifranchiseOwner | null =
      await this.digifranchiseOwnerRepository.findOne({
        where: { id: ownedDigifranchiseId },
      });
    if (!getOwnedDigifranchise) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Owned Digifranchise does not exist',
        },
        HttpStatus.NOT_FOUND
      );
    }
    const today = new Date();
    const currentTime =
      today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const timeSlots = await this.digifranchiseAvailableTimeSlotsRepository.find(
      {
        where: {
          ownedDigifranchise: { id: ownedDigifranchiseId },
          isSlotAvailable: true,
          isSlotBooked: false,
          workingDate: Between(startOfDay, endOfDay),
          ...(workingDate === today.toISOString().split('T')[0] && {
            startTime: MoreThanOrEqual(currentTime),
          }),
        },
      }
    );
    return timeSlots;
  }
  async getBookedTimeSlots(ownedDigifranchiseId: string, workingDate: string) {
    const startOfDay = new Date(workingDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(workingDate);
    endOfDay.setHours(23, 59, 59, 999);
    const getOwnedDigifranchise: DigifranchiseOwner | null =
      await this.digifranchiseOwnerRepository.findOne({
        where: { id: ownedDigifranchiseId },
      });
    if (!getOwnedDigifranchise) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Owned Digifranchise does not exist',
        },
        HttpStatus.NOT_FOUND
      );
    }
    const timeSlots = await this.digifranchiseBookedTimeslotRepository.find({
      where: {
        ownedDigifranchise: { id: ownedDigifranchiseId },
        workingDate: Between(startOfDay, endOfDay),
      },
    });
    return timeSlots;
  }
  async updateWorkingHoursForDigifranchise(
    setWorkingHoursDto: SetWorkingHoursDto,
    ownedFranchiseId: string
  ) {
    const getOwnedDigifranchise: DigifranchiseOwner | null =
      await this.digifranchiseOwnerRepository.findOne({
        where: { id: ownedFranchiseId },
      });
    if (!getOwnedDigifranchise) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Owned Digifranchise does not exist',
        },
        HttpStatus.NOT_FOUND
      );
    }
    const workingHours = await this.digifranchiseWorkingHoursRepository.findOne(
      {
        where: { ownedDigifranchise: { id: ownedFranchiseId } },
      }
    );
    if (!workingHours)
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Digifranchise working hours unavailable!',
        },
        HttpStatus.NOT_FOUND
      );
    await this.digifranchiseWorkingHoursRepository.delete(workingHours.id);

    const slots = await this.digifranchiseAvailableTimeSlotsRepository.find({
      where: { ownedDigifranchise: { id: ownedFranchiseId } },
    });
    for (const slot in slots) {
      await this.digifranchiseAvailableTimeSlotsRepository.delete({
        id: slots[slot]!.id,
        isSlotBooked: false,
      });
    }
    try {
      const data = await this.createWorkingHoursForDigifranchise(
        setWorkingHoursDto,
        ownedFranchiseId
      );
      return data;
    } catch (error) {
      return error;
    }
  }
  async bookAvailabilitySlot(timeslots: any, ownedDigifranchiseId: string) {
    const getOwnedDigifranchise: DigifranchiseOwner | null =
      await this.digifranchiseOwnerRepository.findOne({
        where: { id: ownedDigifranchiseId },
      });
    if (!getOwnedDigifranchise) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Owned Digifranchise does not exist',
        },
        HttpStatus.NOT_FOUND
      );
    }
    for (const slot of timeslots) {
      const updatedTimeSlot =
        await this.digifranchiseAvailableTimeSlotsRepository.update(slot.id, {
          isSlotAvailable: false,
          isSlotBooked: true,
        });
    }
  }
  async newBookAvailabilitySlot(timeslots: any, ownedDigifranchiseId: string) {
    const getOwnedDigifranchise: DigifranchiseOwner | null =
      await this.digifranchiseOwnerRepository.findOne({
        where: { id: ownedDigifranchiseId },
      });
    if (!getOwnedDigifranchise) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Owned Digifranchise does not exist',
        },
        HttpStatus.NOT_FOUND
      );
    }
    for (const slot of timeslots) {
      await this.digifranchiseBookedTimeslotRepository.save(slot);
    }
  }
  private async deleteSlotsAtEndOfDay() {
    try {
      const startOfDay = dayjs().startOf('day').toDate();
      const endOfDay = dayjs().endOf('day').toDate();

      const slotsToDelete =
        await this.digifranchiseAvailableTimeSlotsRepository.find({
          where: {
            workingDate: LessThan(startOfDay),
          },
        });

      for (const slot of slotsToDelete) {
        await this.digifranchiseAvailableTimeSlotsRepository.delete(slot.id);
      }
    } catch (error) {
      console.error('Error deleting slots:', error);
    }
  }
  private async createTimeSlot(
    ownedDigifranchise: DigifranchiseOwner | null,
    day: string,
    workingDate: string,
    isSlotBooked: boolean,
    isSlotAvailable: boolean,
    startTime: string,
    endTime: string
  ): Promise<any> {
    const startOfDay = new Date(workingDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(workingDate);
    endOfDay.setHours(23, 59, 59, 999);
    const existingSlot =
      await this.digifranchiseAvailableTimeSlotsRepository.findOne({
        where: {
          ownedDigifranchise: { id: ownedDigifranchise?.id },
          day: day,
          startTime: startTime,
          endTime: endTime,
          isSlotBooked: true,
          workingDate: Between(startOfDay, endOfDay),
        },
      });
    if (!existingSlot) {
      const newAvailability =
        this.digifranchiseAvailableTimeSlotsRepository.create({
          ownedDigifranchise: ownedDigifranchise,
          isSlotBooked: isSlotBooked,
          day: day,
          workingDate: workingDate,
          isSlotAvailable: isSlotAvailable,
          startTime: startTime,
          endTime: endTime,
        });
      await this.digifranchiseAvailableTimeSlotsRepository.save(
        newAvailability
      );
    }
  }
  calculateAvailableTimeSlots = (
    startTime: string,
    endTime: string,
    slotDuration: number,
    breakTime: number
  ) => {
    const startDate = dayjs(`2024-01-01T${startTime}`);
    const endDate = dayjs(`2024-01-01T${endTime}`);

    const durationInMinutes = endDate.diff(startDate, 'minute');
    const timeSlotDuration = slotDuration;
    const breakTimeDuration = breakTime;
    const numberOfSlots = Math.floor(
      durationInMinutes / (timeSlotDuration + breakTimeDuration)
    );
    const availableTimeSlots: any = [];
    let currentTime = startDate;
    for (let i = 0; i < numberOfSlots; i++) {
      const slotStartTime = currentTime.format('HH:mm');
      currentTime = currentTime.add(timeSlotDuration, 'minute');
      const slotEndTime = currentTime.format('HH:mm');
      availableTimeSlots.push({
        startTime: slotStartTime,
        endTime: slotEndTime,
      });
      currentTime = currentTime.add(breakTimeDuration, 'minute');
    }
    return availableTimeSlots;
  };
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDelete() {
    await this.deleteSlotsAtEndOfDay();
  }
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleClone() {
    const today = new Date();
    if (today.getDate() === 25) {
      const digis = await this.digifranchiseWorkingHoursRepository.find({
        relations: ['ownedDigifranchise'],
      });
      for (const digi of digis) {
        const getOwnedDigifranchise: DigifranchiseOwner | null =
          await this.digifranchiseOwnerRepository.findOne({
            where: { id: digi?.ownedDigifranchise?.id },
          });
        const payload = {
          allowBookingOnPublicHolidays: digi.allowBookingOnPublicHolidays,
          allowedTimeSlotUnits: digi.allowedTimeSlotUnits,
          breakTimeBetweenBookedSlots: digi.breakTimeBetweenBookedSlots,
          unavailability: digi.unavailability,
          availabilityWeekDays: digi.availabilityWeekDays.map((dayInfo) => ({
            day: dayInfo.day,
            isDayFullBooked: false,
            availabilityDayTime: {
              startTime: dayInfo.startTime,
              endTime: dayInfo.endTime,
            },
          })),
        };
        let currentDate = dayjs();
        const currentDay = currentDate.date();
        const endOfCurrentMonth = currentDate.endOf('month').date();
        let daysToCreateSlotsFor = endOfCurrentMonth - currentDay + 1;
        if (currentDay >= 25) {
          const endOfNextMonth = currentDate
            .add(1, 'month')
            .endOf('month')
            .date();
          daysToCreateSlotsFor += endOfNextMonth;
        }
        for (let j = 0; j < daysToCreateSlotsFor; j++) {
          for (let i = 0; i < payload.availabilityWeekDays!.length; i++) {
            const day = payload.availabilityWeekDays![i];
            const dayOfWeek = currentDate.format('dddd');
            if (day.day === dayOfWeek) {
              const slots = this.calculateAvailableTimeSlots(
                day.availabilityDayTime!.startTime,
                day.availabilityDayTime!.endTime,
                payload.allowedTimeSlotUnits,
                payload.breakTimeBetweenBookedSlots
              );
              for (const slot of slots) {
                await this.createTimeSlot(
                  getOwnedDigifranchise,
                  day.day,
                  currentDate.toISOString(),
                  false,
                  true,
                  slot.startTime,
                  slot.endTime
                );
              }
            }
          }
          currentDate = currentDate.add(1, 'day');
        }
      }
    }
  }
}
