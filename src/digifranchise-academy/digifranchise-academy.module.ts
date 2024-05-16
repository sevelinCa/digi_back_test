import { Module } from '@nestjs/common';
import { DigifranchiseAcademyService } from './digifranchise-academy.service';
import { DigifranchiseAcademyController } from './digifranchise-academy.controller';

@Module({
  providers: [DigifranchiseAcademyService],
  controllers: [DigifranchiseAcademyController]
})
export class DigifranchiseAcademyModule {}
