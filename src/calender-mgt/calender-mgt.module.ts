import { Module } from "@nestjs/common";
import { CalenderMgtService } from "./calender-mgt.service";
import {
  CalenderMgtController,
  CalenderMgtVenueNoAutController,
} from "./calender-mgt.controller";
import { CalenderBooking } from "./entities/calender-bookings.entity";
import { CalenderEventOwner } from "./entities/calender-event-owner.entity";
import { CalenderEvents } from "./entities/calender-events.entity";
import { CalenderVenue } from "./entities/calender-venues.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import { CalenderEventGuest } from "./entities/calender-event-guest.entity";
import { CustomerManagement } from "src/digifranchise-mgt/entities/customer-management.entity";
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CalenderBooking,
      CalenderEventOwner,
      CalenderEvents,
      CalenderVenue,
      UserEntity,
      CalenderEventGuest,
      CustomerManagement,
      DigifranchiseOwner,
    ]),
  ],
  providers: [CalenderMgtService],
  controllers: [CalenderMgtController, CalenderMgtVenueNoAutController],
})
export class CalenderMgtModule {}
