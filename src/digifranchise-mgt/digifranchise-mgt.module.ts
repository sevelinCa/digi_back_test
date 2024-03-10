import { Module } from '@nestjs/common';
import { DigifranchiseMgtService } from './digifranchise-mgt.service';
import { AvailabilityManagementService } from './availability-management.service';
import { AvailabilityManagmentController } from './digifranchise-mgt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { AvailableManagement } from './entities/available-management.entity';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AvailableManagement,Digifranchise, UserEntity]),
  ],
  providers: [DigifranchiseMgtService, AvailabilityManagementService],
  controllers: [AvailabilityManagmentController]
})
export class DigifranchiseMgtModule {}
