import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DigifranchiseWorkingHours } from './entities/digifranchise-working-hours.entity';
import { Repository } from 'typeorm';
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

    console.log(workingDays);
    setWorkingHours.ownedDigifranchise = getOwnedDigifranchise;
    setWorkingHours.workingDays = workingDays;
    this.digifranchiseWorkingHoursRepository.save(setWorkingHours);
    // console.log('>>>>>>>>>>', day);
    // console.log('&&&&&&&&&', time);
    // console.log('&&&&&&&&&', date);
    // console.log('----------', futureDate);
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    for (let j = 0; j < 1; j++) {
      currentDate.setDate(currentDate.getDate() + 1);
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

    // check the current day and time
    // get the availability of the current day from availability object
    // if it's not there move onto the next day,
    // if it's there, create timeslots by looking at the allowed time lots units
    // the loop should stop create time slots at the end of 30 days
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
    console.log(getOwnedDigifranchise)
    const ava = await this.digifranchiseWorkingHoursRepository.find({
      // where: { ownedDigifranchise: getOwnedDigifranchise },
      relations: ['ownedDigifranchise'],
    });
    console.log(getOwnedDigifranchise==ava![0].ownedDigifranchise)
    return ava;
  }

  async updateWorkingHoursForDigifranchise(
    setWorkingHoursDto: SetWorkingHoursDto,
    ownedDigifranchiseId: string
  ) {
    console.log(setWorkingHoursDto);
    console.log(ownedDigifranchiseId);
  }
}
