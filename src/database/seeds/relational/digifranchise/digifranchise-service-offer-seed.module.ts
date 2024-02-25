import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { DigifranchiseSeedService } from './digifranchise-service-seed.service';
import { DigifranchiseService } from 'src/digifranchise/entities/digifranchise-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DigifranchiseService,Digifranchise])],
  providers: [DigifranchiseSeedService],
  exports: [DigifranchiseSeedService],
})
export class DigifranchiseServiceOfferSeedModule {}