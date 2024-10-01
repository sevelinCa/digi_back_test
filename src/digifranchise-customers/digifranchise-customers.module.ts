import { Module } from '@nestjs/common';
import { DigifranchiseCustomersController } from './digifranchise-customers.controller';
import { DigifranchiseCustomersService } from './digifranchise-customers.service';

@Module({
  controllers: [DigifranchiseCustomersController],
  providers: [DigifranchiseCustomersService]
})
export class DigifranchiseCustomersModule {}
