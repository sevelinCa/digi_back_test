import { Module } from '@nestjs/common';
import { TrialFuncService } from './trial-func.service';
import { TrialFuncController } from './trial-func.controller';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DigifranchiseOwner,
      Digifranchise,

    ]),
  ],
  providers: [TrialFuncService],
  controllers: [TrialFuncController]
})
export class TrialFuncModule {}
