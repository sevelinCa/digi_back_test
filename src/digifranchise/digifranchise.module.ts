import { Module } from '@nestjs/common';
import { DigifranchiseController, DigifranchiseServiceOfferController } from './digifranchise.controller';
import { DigifranchiseService } from './digifranchise.service';
import { DigifranchiseServiceTable } from './entities/digifranchise-service.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { FranchiseOwnership } from './entities/franchise-ownership.entity';
import { Digifranchise } from './entities/digifranchise.entity';
import { DigifranchiseServiceOfferedService } from './digifranchiseService-offered.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      FranchiseOwnership,
      Digifranchise,
      DigifranchiseServiceTable
    ]),
  ],
  controllers: [DigifranchiseController,DigifranchiseServiceOfferController],
  providers: [DigifranchiseService, DigifranchiseServiceOfferedService]
})
export class DigifranchiseModule {}