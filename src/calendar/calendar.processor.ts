import { Process, Processor } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { AvailabilityTimeSlots } from './entities/time-slots.entity';
import { Between, Repository } from 'typeorm';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';
import dayjs from 'dayjs';
import { SetWorkingHoursDto } from './dto/availability.dto';
import { DigifranchiseWorkingHours } from './entities/digifranchise-working-hours.entity';
import { CalendarService } from './calendar.service';
interface ExtendedSetWorkingHoursDto {
  setWorkingHours: SetWorkingHoursDto;
  ownedDigifranchiseId: string;
}
@Processor('time-slots')
export class TimeSlotsProcessor {
  constructor(
    @InjectRepository(DigifranchiseOwner)
    private readonly digifranchiseOwnerRepository: Repository<DigifranchiseOwner>,
    @InjectRepository(DigifranchiseWorkingHours)
    private readonly digifranchiseWorkingHoursRepository: Repository<DigifranchiseWorkingHours>,
    @InjectRepository(AvailabilityTimeSlots)
    private readonly digifranchiseAvailableTimeSlotsRepository: Repository<AvailabilityTimeSlots>,
    private readonly calendarService: CalendarService
  ) {}
  @Process()
  async createTimeSlots(job: Job<ExtendedSetWorkingHoursDto>) {
    const { data } = job;
    let workingDays: any = [];
    for (
      let i = 0;
      i < data.setWorkingHours.availabilityWeekDays!.length;
      i++
    ) {
      const obj = {
        day: data.setWorkingHours.availabilityWeekDays![i]?.day,
        startTime:
          data.setWorkingHours.availabilityWeekDays![i]?.availabilityDayTime!
            .startTime,
        endTime:
          data.setWorkingHours.availabilityWeekDays![i]?.availabilityDayTime!
            .endTime,
      };
      workingDays.push(obj);
    }
    const getOwnedDigifranchise: DigifranchiseOwner | null =
      await this.digifranchiseOwnerRepository.findOne({
        where: { id: data!.ownedDigifranchiseId },
      });
    const setWorkingHours = this.digifranchiseWorkingHoursRepository.create(
      data.setWorkingHours
    );
    setWorkingHours.ownedDigifranchise = getOwnedDigifranchise;
    setWorkingHours.availabilityWeekDays = workingDays;
    await this.digifranchiseWorkingHoursRepository.save(setWorkingHours);
    let currentDate = new Date();
    const currentDay = dayjs().date();
    const endOfMonth = dayjs().daysInMonth();
    const remainingDays = endOfMonth - currentDay + 1;
    for (let j = 0; j < remainingDays; j++) {
      for (
        let i = 0;
        i < data.setWorkingHours.availabilityWeekDays!.length;
        i++
      ) {
        const day = data.setWorkingHours.availabilityWeekDays![i];
        const dayOfWeek = currentDate.toLocaleDateString('en-US', {
          weekday: 'long',
        });
        if (day.day === dayOfWeek) {
          const slots = this.calculateAvailableTimeSlots(
            day.availabilityDayTime!.startTime,
            day.availabilityDayTime!.endTime,
            data.setWorkingHours.allowedTimeSlotUnits,
            data.setWorkingHours.breakTimeBetweenBookedSlots
          );
          for (const slot of slots) {
            console.log(getOwnedDigifranchise, '=====owned digiiiiii');
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
      currentDate.setDate(currentDate.getDate() + 1);
    }
    if (data.setWorkingHours.unavailability) {
      for (const unAvail of data.setWorkingHours.unavailability) {
        const setUnavailability = await this.calendarService.getTimeSlots(
          data.ownedDigifranchiseId,
          unAvail.workingDate
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
              { isSlotAvailable: false }
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
}
