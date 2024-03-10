import { Module } from '@nestjs/common';
import { AvailabilityManagementService } from './availability-management.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { AvailableManagement } from './entities/available-management.entity';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { AvailabilityManagementController, UnavailableManagementController } from './digifranchise-mgt.controller';
import { UnavailableManagementService } from './unavailability-management.service';
import { UnavailableManagement } from './entities/unavailable-management.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AvailableManagement,Digifranchise, UserEntity, UnavailableManagement]),
  ],
  providers: [AvailabilityManagementService, UnavailableManagementService],
  controllers: [AvailabilityManagementController,UnavailableManagementController]
})
export class DigifranchiseMgtModule {}
