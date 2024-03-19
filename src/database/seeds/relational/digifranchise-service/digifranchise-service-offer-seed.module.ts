import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { DigifranchiseServiceOffered } from 'src/digifranchise/entities/digifranchise-service.entity';
import { DigifranchiseServiceSeedService } from './digifranchise-service-seed.service';
import { DigifranchiseServiceCategory } from 'src/digifranchise/entities/digifranchise-service-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DigifranchiseServiceOffered,Digifranchise,DigifranchiseServiceCategory])],
  providers: [DigifranchiseServiceSeedService],
  exports: [DigifranchiseServiceSeedService],
})
export class DigifranchiseServicerSeedModule {}