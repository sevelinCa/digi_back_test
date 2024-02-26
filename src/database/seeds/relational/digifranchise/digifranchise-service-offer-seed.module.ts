import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { DigifranchiseSeedService } from './digifranchise-service-seed.service';
import { DigifranchiseServiceOffered } from 'src/digifranchise/entities/digifranchise-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DigifranchiseServiceOffered,Digifranchise])],
  providers: [DigifranchiseSeedService],
  exports: [DigifranchiseSeedService],
})
export class DigifranchiseServiceOfferSeedModule {}