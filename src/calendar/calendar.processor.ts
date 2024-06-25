import { Process, Processor } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { AvailabilityTimeSlots } from './entities/time-slots.entity';
import { Repository } from 'typeorm';

@Processor('time-slots')
export class TimeSlotsProcessor {
  constructor(
    @InjectRepository(AvailabilityTimeSlots)
    private readonly digifranchiseAvailableTimeSlotsRepository: Repository<AvailabilityTimeSlots>
  ) {}
  @Process()
  async createTimeSlot(job: Job<any>) {
    const { data } = job;
    this.digifranchiseAvailableTimeSlotsRepository.save(data);
  }
}
