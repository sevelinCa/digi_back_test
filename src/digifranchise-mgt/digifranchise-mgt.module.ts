import { Module } from '@nestjs/common';
import { DigifranchiseMgtService } from './digifranchise-mgt.service';
import { DigifranchiseMgtController } from './digifranchise-mgt.controller';
import { AvailabilityManagementService } from './availability-management.service';

@Module({
  providers: [DigifranchiseMgtService, AvailabilityManagementService],
  controllers: [DigifranchiseMgtController]
})
export class DigifranchiseMgtModule {}
