import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { DigifranchiseSeedService } from './digifranchise-service-seed.service';
import { DigifranchiseServiceTable } from 'src/digifranchise/entities/digifranchise-service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DigifranchiseServiceTable,Digifranchise])],
  providers: [DigifranchiseSeedService],
  exports: [DigifranchiseSeedService],
})
export class DigifranchiseServiceOfferSeedModule {}