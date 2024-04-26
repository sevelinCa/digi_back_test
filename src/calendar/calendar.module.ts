import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DigifranchiseWorkingHours } from './entities/digifranchise-working-hours.entity';
import { AvailabilityTimeSlots } from './entities/time-slots.entity';
import { DigifranchiseUnavailableTimes } from './entities/unavailable-times.entity';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DigifranchiseOwner,
      DigifranchiseWorkingHours,
      AvailabilityTimeSlots,
      DigifranchiseUnavailableTimes
    ]),
  ],
  providers: [CalendarService],
  controllers: [CalendarController]
})
export class CalendarModule {}
