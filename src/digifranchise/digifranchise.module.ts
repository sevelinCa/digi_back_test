import { Module } from '@nestjs/common';
import { DigifranchiseController } from './digifranchise.controller';
import { DigifranchiseService } from './digifranchise.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/domain/user';
import { DigifranchiseAccount } from './entities/digifranchise-account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      DigifranchiseAccount
    ]),
  ],
  controllers: [DigifranchiseController],
  providers: [DigifranchiseService]
})
export class DigifranchiseModule {}
