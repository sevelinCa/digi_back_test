import { Module } from '@nestjs/common';
import { DigifranchiseController } from './digifranchise.controller';
import { DigifranchiseService } from './digifranchise.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Digifranchise } from './entities/digifranchise.entity';
import { DigifranchiseServiceOffered } from './entities/digifranchise-service.entity';
import { DigifranchiseOwner } from './entities/digifranchise-ownership.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      DigifranchiseServiceOffered,
      Digifranchise,
      DigifranchiseOwner,
      
    ]),
  ],
  controllers: [DigifranchiseController],
  providers: [DigifranchiseService]
})
export class DigifranchiseModule {}