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
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(DigifranchiseOwner)
    private readonly digifranchiseOwnerRepository: Repository<DigifranchiseOwner>,
    @InjectRepository(DigifranchiseWorkingHours)
    private readonly digifranchiseWorkingHoursRepository: Repository<DigifranchiseWorkingHours>,
    @InjectRepository(AvailabilityTimeSlots)
    private readonly digifranchiseAvailableTimeSlotsRepository: Repository<AvailabilityTimeSlots>,
    @InjectQueue("time-slots") private readonly timeSlotsQueue: Queue,
  ) {}

  async createWorkingHoursForDigifranchise(
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
    const isTimeSlotsExists =
      await this.digifranchiseWorkingHoursRepository.findOne({
        where: { ownedDigifranchise: { id: ownedDigifranchiseId } },
      });
    if (isTimeSlotsExists) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: "Digifranchise timeslots has already been created",
        },
        HttpStatus.CONFLICT,
      );
    }
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
    await this.digifranchiseWorkingHoursRepository.findOne({
      where: {
        ownedDigifranchise: { id: ownedDigifranchiseId },
      },
    });
    return timeSlots;
  }

  async updateWorkingHoursForDigifranchise(
    setWorkingHoursDto: SetWorkingHoursDto,
    ownedFranchiseId: string,
  ) {
    const getOwnedDigifranchise: DigifranchiseOwner | null =
      await this.digifranchiseOwnerRepository.findOne({
        where: { id: ownedFranchiseId },
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
        where: { ownedDigifranchise: { id: ownedFranchiseId } },
      },
    );
    await this.digifranchiseWorkingHoursRepository.delete(workingHours!.id);

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
        ownedFranchiseId,
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
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleClone() {
    const today = new Date();
    if (today.getDate() === 31) {
      const digis = await this.digifranchiseWorkingHoursRepository.find({
        relations: ["ownedDigifranchise"],
      });
      for (const digi of digis) {
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
}
