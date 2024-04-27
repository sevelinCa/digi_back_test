import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DigifranchiseWorkingHours } from './entities/digifranchise-working-hours.entity';
import { Between, Repository } from 'typeorm';
import { AvailabilityTimeSlots } from './entities/time-slots.entity';
import { DigifranchiseUnavailableTimes } from './entities/unavailable-times.entity';
import {
  AvailabilityWeekDaysDto,
  SetWorkingHoursDto,
} from './dto/availability.dto';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';
import { response } from 'express';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(DigifranchiseOwner)
    private readonly digifranchiseOwnerRepository: Repository<DigifranchiseOwner>,
    @InjectRepository(DigifranchiseWorkingHours)
    private readonly digifranchiseWorkingHoursRepository: Repository<DigifranchiseWorkingHours>,
    @InjectRepository(AvailabilityTimeSlots)
    private readonly digifranchiseAvailableTimeSlotsRepository: Repository<AvailabilityTimeSlots>,
    @InjectRepository(DigifranchiseUnavailableTimes)
    private readonly digifranchiseUnavailableTimes: Repository<DigifranchiseUnavailableTimes>
  ) {}

  async createWorkingHoursForDigifranchise(
    setWorkingHoursDto: SetWorkingHoursDto,
    ownedDigifranchiseId: string
  ) {
    const {
      allowedTimeSlotUnits,
      availabilityWeekDays,
      breakTimeBetweenBookedSlots,
      unavailability,
    } = setWorkingHoursDto;
    let currentDate = new Date();
    // const date = currentDate;
    // const day = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
    // const time = currentDate.toLocaleTimeString([], {
    //   hour: '2-digit',
    //   minute: '2-digit',
    //   second: '2-digit',
    //   hour12: false,
    // });
    // const futureDate = new Date(
    //   currentDate.getTime() + 30 * 24 * 60 * 60 * 1000
    // );

    const setWorkingHours =
      this.digifranchiseWorkingHoursRepository.create(setWorkingHoursDto);
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
    const isTimeSlotsExists =
      await this.digifranchiseAvailableTimeSlotsRepository.find({
        where: { ownedDigifranchise: getOwnedDigifranchise },
      });
    // if (isTimeSlotsExists) {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.CONFLICT,
    //       error: 'Digifranchise timeslots has already been created',
    //     },
    //     HttpStatus.CONFLICT
    //   );
    // }
    let workingDays: any = [];
    for (let i = 0; i < availabilityWeekDays!.length; i++) {
      console.log(availabilityWeekDays![i].availabilityDayTime![0].startTime);
      const obj = {
        day: availabilityWeekDays![i].day,
        startTime: availabilityWeekDays![i].availabilityDayTime![0].startTime,
        endTime: availabilityWeekDays![i].availabilityDayTime![0].endTime,
      };
      workingDays.push(JSON.stringify(obj));
    }
    setWorkingHours.ownedDigifranchise = getOwnedDigifranchise;
    setWorkingHours.workingDays = workingDays;
    this.digifranchiseWorkingHoursRepository.save(setWorkingHours);
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    for (let j = 0; j < 30; j++) {
      for (let i = 0; i < availabilityWeekDays!.length; i++) {
        const day = availabilityWeekDays![i];
        const dayOfWeek = currentDate.toLocaleDateString('en-US', {
          weekday: 'long',
        });
        if (day.day === dayOfWeek) {
          const slots = this.calculateAvailableTimeSlots(
            day.availabilityDayTime![0].startTime!,
            day.availabilityDayTime![0].endTime!,
            allowedTimeSlotUnits,
            breakTimeBetweenBookedSlots
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
            await delay(10);
          }
        }
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    if (unavailability) {
      const setUnavailability = unavailability.map((unavail) => {
        return {
          workingDate: unavailability![0].workingDate,
          startTime: unavailability![0].startTime,
          endTime: unavailability![0].endTime,
          ownedDigifranchise: getOwnedDigifranchise,
        };
      });
      await this.digifranchiseUnavailableTimes.save(setUnavailability);
    }
  }
  calculateAvailableTimeSlots(
    startTime: string,
    endTime: string,
    slotDuration: number,
    breakTime: number
  ) {
    const startDate = new Date(`2024-01-01T${startTime}`);
    const endDate = new Date(`2024-01-01T${endTime}`);
    const durationInMinutes =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60);
    const timeSlotDuration = slotDuration;
    const breakTimeDuration = breakTime;
    const numberOfSlots = Math.floor(
      durationInMinutes / (timeSlotDuration + breakTimeDuration)
    );
    const availableTimeSlots: { startTime: string; endTime: string }[] = [];
    let currentTime = startDate;
    for (let i = 0; i < numberOfSlots; i++) {
      const slotStartTime = currentTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      currentTime = new Date(currentTime.getTime() + timeSlotDuration * 60000);
      const slotEndTime = currentTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      availableTimeSlots.push({
        startTime: slotStartTime,
        endTime: slotEndTime,
      });
      currentTime = new Date(currentTime.getTime() + breakTimeDuration * 60000);
    }
    return availableTimeSlots;
  }
  private async createTimeSlot(
    ownedDigifranchise: DigifranchiseOwner,
    day: string,
    workingDate: string,
    isSlotBooked: boolean,
    isSlotAvailable: boolean,
    startTime: string,
    endTime: string
  ): Promise<any> {
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
    return this.digifranchiseAvailableTimeSlotsRepository.save(newAvailability);
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
    const timeSlots = await this.digifranchiseAvailableTimeSlotsRepository.find(
      {
        where: {
          ownedDigifranchise: { id: ownedDigifranchiseId },
          isSlotAvailable: true,
          isSlotBooked: false,
          workingDate: Between(startOfDay, endOfDay),
        },
      }
    );
    const workingHours = await this.digifranchiseWorkingHoursRepository.findOne(
      {
        where: {
          ownedDigifranchise: { id: ownedDigifranchiseId },
        },
      }
    );
    const unavailableSlots = await this.digifranchiseUnavailableTimes.find({
      where: {
        ownedDigifranchise: { id: ownedDigifranchiseId },
        workingDate: Between(startOfDay, endOfDay),
      },
    });
    const unSlots: any = [];
    for (const unslot of unavailableSlots) {
      console.log(unslot);
      const unSlotss = this.calculateAvailableTimeSlots(
        unslot.startTime,
        unslot.endTime,
        workingHours!.allowedTimeSlotUnits,
        workingHours!.breakTimeBetweenBookedSlots
      );
      unSlots.push(unSlotss);
    }

    const availableTimeSlots = timeSlots.filter((slot) => {
      for (const unslot of unSlots) {
        if (
          slot.startTime >= unslot.startTime &&
          slot.endTime <= unslot.endTime
        ) {
          return false;
        }
      }
      return true;
    });

    return availableTimeSlots;
  }

  async updateWorkingHoursForDigifranchise(
    setWorkingHoursDto: SetWorkingHoursDto,
    ownedDigifranchiseId: string
  ) {
    const workingHours = await this.digifranchiseWorkingHoursRepository.findOne(
      {
        where: { ownedDigifranchise: { id: ownedDigifranchiseId } },
      }
    );
    await this.digifranchiseWorkingHoursRepository.delete(workingHours!.id);

    const slots = await this.digifranchiseAvailableTimeSlotsRepository.find({
      where: { ownedDigifranchise: { id: ownedDigifranchiseId } },
    });
    for (const slot in slots) {
      await this.digifranchiseAvailableTimeSlotsRepository.delete(
        slots[slot]!.id
      );
    }
    const unavailableSlots = await this.digifranchiseUnavailableTimes.find({
      where: { ownedDigifranchise: { id: ownedDigifranchiseId } },
    });
    for (const slot in unavailableSlots) {
      await this.digifranchiseUnavailableTimes.delete(
        unavailableSlots[slot]!.id
      );
    }
    const data = await this.createWorkingHoursForDigifranchise(
      setWorkingHoursDto,
      ownedDigifranchiseId
    );
    return data;
  }
  async bookAvailabilitySlot(slotId: string, ownedDigifranchiseId: string) {
    const availabilitySlot =
      await this.digifranchiseAvailableTimeSlotsRepository.findOne({
        where: { ownedDigifranchise: { id: ownedDigifranchiseId }, id: slotId },
      });
    if (availabilitySlot) {
      const updatedTimeSlot =
        await this.digifranchiseAvailableTimeSlotsRepository.update(
          { ownedDigifranchise: { id: ownedDigifranchiseId }, id: slotId },
          {
            isSlotAvailable: true,
            isSlotBooked: false,
          }
        );
      return updatedTimeSlot;
    }
  }
}
