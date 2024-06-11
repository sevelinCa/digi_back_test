import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderTable } from "src/payment/entities/order.entity";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import { OptionalFunctionalController } from "./optional-functional.controller";
import { OptionalFunctionalService } from "./optional-functional.service";
import { DigifranchiseWorkingHours } from "src/calendar/entities/digifranchise-working-hours.entity";
import { CalenderVenue } from "src/calender-mgt/entities/calender-venues.entity";
import {
  Availability,
  AvailabilityWeekDays,
  AvailabilityDayTime,
  Unavailability,
  AvailabilitySlotsTimeOneOne,
} from "src/digifranchise-mgt/entities/availability.entity";
import { CustomerManagement } from "src/digifranchise-mgt/entities/customer-management.entity";
import { InventoryManagement } from "src/digifranchise-mgt/entities/inventory-management.entity";
import { StaffManagement } from "src/digifranchise-mgt/entities/staff-management.entity";
import { SupplierManagement } from "src/digifranchise-mgt/entities/supplier-management.entity";
import { UnavailableManagement } from "src/digifranchise-mgt/entities/unavailable-management.entity";
import { DigifranchiseExpense } from "src/digifranchise/entities/digifranchise-expense.entity";
import { DigifranchiseGalleryImage } from "src/digifranchise/entities/digifranchise-gallery-images.entity";
import { DigifranchiseGeneralInfo } from "src/digifranchise/entities/digifranchise-general-information.entity";
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";
import { DigifranchiseSelectProductOrServiceTable } from "src/digifranchise/entities/digifranchise-select-product-service.entity";
import { DigifranchiseServiceOffered } from "src/digifranchise/entities/digifranchise-service-offered.entity";
import { DigifranchiseSubProduct } from "src/digifranchise/entities/digifranchise-sub-product.entity";
import { DigifranchiseSubServices } from "src/digifranchise/entities/digifranchise-sub-service.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      OrderTable,
      DigifranchiseGeneralInfo,
      DigifranchiseOwner,
      DigifranchiseGalleryImage,
      DigifranchiseExpense,
      DigifranchiseServiceOffered,
      DigifranchiseSubServices,
      DigifranchiseSubProduct,
      DigifranchiseSelectProductOrServiceTable,
      DigifranchiseWorkingHours,
      UnavailableManagement,
      CustomerManagement,
      StaffManagement,
      SupplierManagement,
      InventoryManagement,
      CalenderVenue,
      OrderTable,
      Availability,
      AvailabilityWeekDays,
      AvailabilityDayTime,
      Unavailability,
      AvailabilitySlotsTimeOneOne,
      UserEntity,
    ]),
  ],
  controllers: [OptionalFunctionalController],
  providers: [OptionalFunctionalService],
})
export class OptionalFunctionalModule {}
