import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DigifranchiseWorkingHours } from './entities/digifranchise-working-hours.entity';
import { Repository } from 'typeorm';
import { AvailabilityTimeSlots } from './entities/time-slots.entity';
import { DigifranchiseUnavailableTimes } from './entities/unavailable-times.entity';
import { AvailabilityWeekDaysDto, SetWorkingHoursDto } from './dto/availability.dto';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';

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
    private readonly digifranchiseUnavailableTimes: Repository<DigifranchiseUnavailableTimes>,
  ) { }

  async createWorkingHoursForDigifranchise(setWorkingHoursDto: SetWorkingHoursDto, ownedDigifranchiseId: string) {
    const { 
      allowedTimeSlotUnits, 
      availabilityWeekDays, 
      breakTimeBetweenBookedSlots,
      unavailability 
    } = setWorkingHoursDto
    const currentDate = new Date()
    const date = currentDate.toLocaleDateString('en-US');
    const day = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
    const time = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false  });
    const futureDate = new Date(currentDate.getTime() + (30 * 24 * 60 * 60 * 1000));

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const setWorkingHours = this.digifranchiseWorkingHoursRepository.create(setWorkingHoursDto)
    const getOwnedDigifranchise: DigifranchiseOwner | null = await this.digifranchiseOwnerRepository.findOne({ where: { id: ownedDigifranchiseId }})
    if (!getOwnedDigifranchise) {
      console.log("digifranchise does not exist")
    }
    setWorkingHours.ownedDigifranchise = getOwnedDigifranchise
    this.digifranchiseWorkingHoursRepository.save(setWorkingHours)

    console.log(">>>>>>>>>>", day)
    console.log("&&&&&&&&&", time)
    console.log("&&&&&&&&&", date)
    console.log("----------", futureDate)
    // console.log("*********", unavailability)

    availabilityWeekDays?.map((day: AvailabilityWeekDaysDto) => {
      console.log("----------", day)

    })
  }

  private async createTimeSlot(
    ownedDigifranchise: DigifranchiseOwner, 
    day: string, 
    isSlotBooked: boolean, 
    isSlotAvailable: boolean,
    startTime: string,
    endTime: string
  ): Promise<any> {
    const newAvailability = this.digifranchiseAvailableTimeSlotsRepository.create({
      ownedDigifranchise: ownedDigifranchise,
      isSlotBooked: isSlotBooked,
      isSlotAvailable: isSlotAvailable,
      startTime: startTime,
      endTime: endTime
    });

    return this.digifranchiseAvailableTimeSlotsRepository.save(newAvailability);
}

  async updateWorkingHoursForDigifranchise(setWorkingHoursDto: SetWorkingHoursDto, ownedDigifranchiseId: string) {
    console.log(setWorkingHoursDto)
    console.log(ownedDigifranchiseId)
  }
}
