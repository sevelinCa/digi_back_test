import { Module } from '@nestjs/common';
import { AvailabilityManagementService } from './availability-management.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { AvailableManagement } from './entities/available-management.entity';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { AvailabilityManagementController, CustomerManagementController, SupplierManagementController, UnavailableManagementController } from './digifranchise-mgt.controller';
import { UnavailableManagementService } from './unavailability-management.service';
import { UnavailableManagement } from './entities/unavailable-management.entity';
import { CustomerManagementService } from './customer-management.service';
import { CustomerManagement } from './entities/customer-management.entity';
import { SupplierManagementService } from './supplier-management.service';
import { SupplierManagement } from './entities/supplier-management.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AvailableManagement,Digifranchise, UserEntity, CustomerManagement, UnavailableManagement, SupplierManagement]),
  ],
  providers: [AvailabilityManagementService, UnavailableManagementService, CustomerManagementService, SupplierManagementService],
  controllers: [AvailabilityManagementController,UnavailableManagementController,CustomerManagementController,SupplierManagementController]
})
export class DigifranchiseMgtModule {}
