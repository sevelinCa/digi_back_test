import { Module } from '@nestjs/common';
import { AvailabilityManagementService } from './availability-management.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { AvailableManagement } from './entities/available-management.entity';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { AvailabilityManagementController, CustomerManagementController, UnavailableManagementController } from './digifranchise-mgt.controller';
import { UnavailableManagementService } from './unavailability-management.service';
import { UnavailableManagement } from './entities/unavailable-management.entity';
import { CustomerManagementService } from './customer-management.service';
import { CustomerManagement } from './entities/customer-management.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AvailableManagement,Digifranchise, UserEntity, CustomerManagement, UnavailableManagement]),
  ],
  providers: [AvailabilityManagementService, UnavailableManagementService, CustomerManagementService],
  controllers: [AvailabilityManagementController,UnavailableManagementController,CustomerManagementController]
})
export class DigifranchiseMgtModule {}
