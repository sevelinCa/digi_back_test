import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
// import { AvailabilityManagementService } from './availability-management.service';
// import { AvailableManagement } from './entities/available-management.entity';
// import { UnavailableManagement } from './entities/unavailable-management.entity';
// import { AvailabilityManagementController, AvailabilityNoAuthManagementController, CustomerManagementController, InventoryManagementController, StaffManagementController, SupplierManagementController, UnavailableManagementController } from './digifranchise-mgt.controller';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { UnavailableManagementService } from './unavailability-management.service';
import { CustomerManagementService } from './customer-management.service';
import { CustomerManagement } from './entities/customer-management.entity';
import { SupplierManagementService } from './supplier-management.service';
import { SupplierManagement } from './entities/supplier-management.entity';
import { InventoryManagementService } from './inventory-management.service';
import { StaffManagementService } from './staff-management.service';
import { StaffManagement } from './entities/staff-management.entity';
import { InventoryManagement } from './entities/inventory-management.entity';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';
import { AvailabilityService } from './availability.service';
import { AvailabilityController } from './availability.controller';
import { AvailabilityWeekDays, AvailabilityDayTime, Availability, Unavailability, AvailabilitySlotsDetails,  AvailabilityBookedSlots, AvailabilitySlotsTimeOneOne } from './entities/availability.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // AvailableManagement,
      Digifranchise,
      DigifranchiseOwner,
      UserEntity,
      CustomerManagement,
      // UnavailableManagement,
      SupplierManagement,
      StaffManagement,
      InventoryManagement,
      AvailabilityWeekDays,
      AvailabilityDayTime,
      Availability,
      AvailabilitySlotsDetails,
      Unavailability,
      AvailabilityBookedSlots,
      AvailabilitySlotsTimeOneOne,
    ]),
  ],
  providers: [
    // AvailabilityManagementService,
    UnavailableManagementService,
    CustomerManagementService,
    SupplierManagementService,
    InventoryManagementService,
    StaffManagementService,
    AvailabilityService,
    // UnavailabilityService,
  ],
  controllers: [
    // AvailabilityManagementController,
    // AvailabilityNoAuthManagementController,
    // UnavailableManagementController,
    // CustomerManagementController,
    // SupplierManagementController,
    // StaffManagementController,
    // InventoryManagementController,
    AvailabilityController,
  ]
})
export class DigifranchiseMgtModule { }



