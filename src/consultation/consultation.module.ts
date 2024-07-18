import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';
import { ConsultationService } from './consultation.service';
import { ConsultationController } from './consultation.controller';
import { ConsultationTable } from './entities/consultation.entity';
import { AvailabilityTimeSlots } from 'src/calendar/entities/time-slots.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DigifranchiseOwner,
      ConsultationTable,
      AvailabilityTimeSlots
    ])
  ],
  providers: [ConsultationService],
  controllers: [ConsultationController],
})
export class ConsultationModule {}
