import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DigifranchiseWorkingHours } from "./entities/digifranchise-working-hours.entity";
import { Between, LessThan, MoreThanOrEqual, Repository } from "typeorm";
import { AvailabilityTimeSlots } from "./entities/time-slots.entity";
import * as schedule from "node-schedule";
// import { DigifranchiseUnavailableTimes } from './entities/unavailable-times.entity';
import {
  AvailabilityWeekDaysDto,
  SetWorkingHoursDto,
} from "./dto/availability.dto";
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";
import { response } from "express";
import { exit } from "process";
import { startOfToday } from "date-fns";
import dayjs from "dayjs";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(DigifranchiseOwner)
    private readonly digifranchiseOwnerRepository: Repository<DigifranchiseOwner>,
    @InjectRepository(DigifranchiseWorkingHours)
    private readonly digifranchiseWorkingHoursRepository: Repository<DigifranchiseWorkingHours>,
    @InjectRepository(AvailabilityTimeSlots)
    private readonly digifranchiseAvailableTimeSlotsRepository: Repository<AvailabilityTimeSlots>,
  ) {}

  async createWorkingHoursForDigifranchise(
    setWorkingHoursDto: SetWorkingHoursDto,
    ownedDigifranchiseId: string,
  ) {
    const {
      allowedTimeSlotUnits,
      availabilityWeekDays,
      breakTimeBetweenBookedSlots,
      unavailability,
    } = setWorkingHoursDto;
    let currentDate = new Date();
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
          error: "Owned Digifranchise does not exist",
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const isTimeSlotsExists =
      await this.digifranchiseWorkingHoursRepository.findOne({
        where: { ownedDigifranchise: { id: ownedDigifranchiseId } },
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
      const obj = {
        day: availabilityWeekDays![i]?.day,
        startTime: availabilityWeekDays![i]?.availabilityDayTime!.startTime,
        endTime: availabilityWeekDays![i]?.availabilityDayTime!.endTime,
      };
      workingDays.push(obj);
    }
    setWorkingHours.ownedDigifranchise = getOwnedDigifranchise;
    setWorkingHours.availabilityWeekDays = workingDays;
    await this.digifranchiseWorkingHoursRepository.save(setWorkingHours);
    const currentDay = dayjs().date();
    const endOfMonth = dayjs().daysInMonth();
    const remainingDays = endOfMonth - currentDay + 1;
    for (let j = 0; j < remainingDays; j++) {
      for (let i = 0; i < availabilityWeekDays!.length; i++) {
        const day = availabilityWeekDays![i];
        const dayOfWeek = currentDate.toLocaleDateString("en-US", {
          weekday: "long",
        });
        if (day.day === dayOfWeek) {
          const slots = this.calculateAvailableTimeSlots(
            day.availabilityDayTime!.startTime,
            day.availabilityDayTime!.endTime,
            allowedTimeSlotUnits,
            breakTimeBetweenBookedSlots,
          );
          for (const slot of slots) {
            await this.createTimeSlot(
              getOwnedDigifranchise,
              day.day,
              currentDate.toISOString(),
              false,
              true,
              slot.startTime,
              slot.endTime,
            );
          }
        }
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    if (unavailability) {
      for (const unAvail of unavailability) {
        const setUnavailability = await this.getTimeSlots(
          ownedDigifranchiseId,
          unAvail.workingDate,
        );
        for (const unSlot of setUnavailability) {
          if (
            (unSlot.startTime < unAvail.endTime &&
              unSlot.endTime > unAvail.startTime) ||
            (unSlot.startTime === unAvail.startTime &&
              unSlot.endTime === unAvail.endTime)
          ) {
            await this.digifranchiseAvailableTimeSlotsRepository.update(
              unSlot.id,
              { isSlotAvailable: false },
            );
          }
        }
      }
    }
  }
  calculateAvailableTimeSlots = (
    startTime: string,
    endTime: string,
    slotDuration: number,
    breakTime: number,
  ) => {
    const startDate = dayjs(`2024-01-01T${startTime}`);
    const endDate = dayjs(`2024-01-01T${endTime}`);

    const durationInMinutes = endDate.diff(startDate, "minute");
    const timeSlotDuration = slotDuration;
    const breakTimeDuration = breakTime;
    const numberOfSlots = Math.floor(
      durationInMinutes / (timeSlotDuration + breakTimeDuration),
    );
    const availableTimeSlots: any = [];
    let currentTime = startDate;
    for (let i = 0; i < numberOfSlots; i++) {
      const slotStartTime = currentTime.format("HH:mm");
      currentTime = currentTime.add(timeSlotDuration, "minute");
      const slotEndTime = currentTime.format("HH:mm");
      availableTimeSlots.push({
        startTime: slotStartTime,
        endTime: slotEndTime,
      });
      currentTime = currentTime.add(breakTimeDuration, "minute");
    }
    return availableTimeSlots;
  };
  private async createTimeSlot(
    ownedDigifranchise: DigifranchiseOwner,
    day: string,
    workingDate: string,
    isSlotBooked: boolean,
    isSlotAvailable: boolean,
    startTime: string,
    endTime: string,
  ): Promise<any> {
    const startOfDay = new Date(workingDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(workingDate);
    endOfDay.setHours(23, 59, 59, 999);
    const existingSlot =
      await this.digifranchiseAvailableTimeSlotsRepository.findOne({
        where: {
          ownedDigifranchise: { id: ownedDigifranchise.id },
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
      return this.digifranchiseAvailableTimeSlotsRepository.save(
        newAvailability,
      );
    }
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
          error: "Owned Digifranchise does not exist",
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const workingDays = await this.digifranchiseWorkingHoursRepository.findOne({
      where: { ownedDigifranchise: { id: ownedDigifranchiseId } },
      relations: ["ownedDigifranchise"],
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
          error: "Owned Digifranchise does not exist",
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const today = new Date();
    const currentTime =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const timeSlots = await this.digifranchiseAvailableTimeSlotsRepository.find(
      {
        where: {
          ownedDigifranchise: { id: ownedDigifranchiseId },
          isSlotAvailable: true,
          isSlotBooked: false,
          workingDate: Between(startOfDay, endOfDay),
          ...(workingDate === today.toISOString().split("T")[0] && {
            startTime: MoreThanOrEqual(currentTime),
          }),
        },
      },
    );
    const workingHours = await this.digifranchiseWorkingHoursRepository.findOne(
      {
        where: {
          ownedDigifranchise: { id: ownedDigifranchiseId },
        },
      },
    );
    return timeSlots;
  }

  async updateWorkingHoursForDigifranchise(
    setWorkingHoursDto: SetWorkingHoursDto,
    ownedDigifranchiseId: string,
  ) {
    const getOwnedDigifranchise: DigifranchiseOwner | null =
      await this.digifranchiseOwnerRepository.findOne({
        where: { id: ownedDigifranchiseId },
      });
    if (!getOwnedDigifranchise) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: "Owned Digifranchise does not exist",
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const workingHours = await this.digifranchiseWorkingHoursRepository.findOne(
      {
        where: { ownedDigifranchise: { id: ownedDigifranchiseId } },
      },
    );
    await this.digifranchiseWorkingHoursRepository.delete(workingHours!.id);

    const slots = await this.digifranchiseAvailableTimeSlotsRepository.find({
      where: { ownedDigifranchise: { id: ownedDigifranchiseId } },
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
        ownedDigifranchiseId,
      );
      return data;
    } catch (error) {
      return error;
    }
    // return data;
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
          error: "Owned Digifranchise does not exist",
        },
        HttpStatus.NOT_FOUND,
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
  private async deleteSlotsAtEndOfDay() {
    try {
      const startOfDay = dayjs().startOf("day").toDate();
      const endOfDay = dayjs().endOf("day").toDate();

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
      console.error("Error deleting slots:", error);
    }
  }
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDelete() {
    await this.deleteSlotsAtEndOfDay();
  }
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async handleClone() {
    const digis = await this.digifranchiseWorkingHoursRepository.find({
      relations: ["ownedDigifranchise"],
    });
    for (const digi of digis) {
      console.log(digi);
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
      await this.updateWorkingHoursForDigifranchise(
        payload,
        digi.ownedDigifranchise!.id,
      );
    }
  }
}
