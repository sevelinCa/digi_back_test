import { Module } from '@nestjs/common';
import { DigifranchiseController } from './digifranchise.controller';
import { DigifranchiseService } from './digifranchise.service';

@Module({
  controllers: [DigifranchiseController],
  providers: [DigifranchiseService]
})
export class DigifranchiseModule {}
