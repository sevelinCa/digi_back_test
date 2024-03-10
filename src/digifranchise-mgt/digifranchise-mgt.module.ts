import { Module } from '@nestjs/common';
import { DigifranchiseMgtService } from './digifranchise-mgt.service';
import { AvailabilityManagementService } from './availability-management.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { AvailableManagement } from './entities/available-management.entity';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { AvailabilityManagementController } from './digifranchise-mgt.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AvailableManagement,Digifranchise, UserEntity]),
  ],
  providers: [DigifranchiseMgtService, AvailabilityManagementService],
  controllers: [AvailabilityManagementController]
})
export class DigifranchiseMgtModule {}
