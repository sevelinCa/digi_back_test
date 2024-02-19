import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/domain/user';
import { Inventory } from './entities/inventory.entity';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Inventory,
      Digifranchise,
      User
    ]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService]
})
export class InventoryModule { }
