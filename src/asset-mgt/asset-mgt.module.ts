import { Module } from "@nestjs/common";
import { AssetMgtService } from "./asset-mgt.service";
import { AssetMgtController } from "./asset-mgt.controller";
import { Asset } from "./entities/asset.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Asset, DigifranchiseOwner])],
  providers: [AssetMgtService],
  controllers: [AssetMgtController],
})
export class AssetMgtModule {}
