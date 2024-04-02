import { Module } from '@nestjs/common';
import { AvailabilityManagementService } from './availability-management.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { AvailableManagement } from './entities/available-management.entity';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { AvailabilityManagementController, CustomerManagementController, InventoryManagementController, StaffManagementController, SupplierManagementController, UnavailableManagementController } from './digifranchise-mgt.controller';
import { UnavailableManagementService } from './unavailability-management.service';
import { UnavailableManagement } from './entities/unavailable-management.entity';
import { CustomerManagementService } from './customer-management.service';
import { CustomerManagement } from './entities/customer-management.entity';
import { SupplierManagementService } from './supplier-management.service';
import { SupplierManagement } from './entities/supplier-management.entity';
import { InventoryManagementService } from './inventory-management.service';
import { StaffManagementService } from './staff-management.service';
import { StaffManagement } from './entities/staff-management.entity';
import { InventoryManagement } from './entities/inventory-management.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AvailableManagement,Digifranchise, UserEntity, CustomerManagement, UnavailableManagement, SupplierManagement, StaffManagement, InventoryManagement ]),
  ],
  providers: [AvailabilityManagementService, UnavailableManagementService, CustomerManagementService, SupplierManagementService, InventoryManagementService, StaffManagementService,  ],
  controllers: [AvailabilityManagementController,UnavailableManagementController,CustomerManagementController,SupplierManagementController,StaffManagementController, InventoryManagementController, ]
})
export class DigifranchiseMgtModule {}



