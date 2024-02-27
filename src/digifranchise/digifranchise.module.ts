import { Module } from '@nestjs/common';
import { DigifranchiseController } from './digifranchise.controller';
import { DigifranchiseService } from './digifranchise.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Digifranchise } from './entities/digifranchise.entity';
import { DigifranchiseServiceOffered } from './entities/digifranchise-service.entity';
import { DigifranchiseOwner } from './entities/digifranchise-ownership.entity';
import { DigifranchiseGeneralInfoService } from './digifranchise-general-information.service';
import { DigifranchiseGeneralInfo } from './entities/digifranchise-general-information.entity';
import { DigifranchiseSubServices } from './entities/digifranchise-sub-service.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      DigifranchiseServiceOffered,
      DigifranchiseSubServices,
      Digifranchise,
      DigifranchiseOwner,
      DigifranchiseGeneralInfo
    ]),
  ],
  controllers: [DigifranchiseController],
  providers: [DigifranchiseService, DigifranchiseGeneralInfoService]
})
export class DigifranchiseModule {}