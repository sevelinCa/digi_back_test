import { Module } from "@nestjs/common";
import { InventoryService } from "./inventory.service";
import { InventoryController } from "./inventory.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Inventory } from "./entities/inventory.entity";
import { Digifranchise } from "src/digifranchise/entities/digifranchise.entity";
import { InventoryEntries } from "./entities/inventory-entries.entity";
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Inventory,
      InventoryEntries,
      Digifranchise,
      DigifranchiseOwner,
    ]),
  ],
  providers: [InventoryService],
  controllers: [InventoryController],
})
export class InventoryModule {}
