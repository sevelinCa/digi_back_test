import { Module } from "@nestjs/common";
import { CalendarService } from "./calendar.service";
import { CalendarController } from "./calendar.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DigifranchiseWorkingHours } from "./entities/digifranchise-working-hours.entity";
import { AvailabilityTimeSlots } from "./entities/time-slots.entity";
// import { DigifranchiseUnavailableTimes } from './entities/unavailable-times.entity';
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";
import { BullModule } from "@nestjs/bull";
import { TimeSlotsProcessor } from "./calendar.processor";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DigifranchiseOwner,
      DigifranchiseWorkingHours,
      AvailabilityTimeSlots,
      // DigifranchiseUnavailableTimes
    ]),
    BullModule.registerQueue({
      name: "time-slots",
    }),
  ],
  providers: [CalendarService, TimeSlotsProcessor],
  controllers: [CalendarController],
})
export class CalendarModule {}
