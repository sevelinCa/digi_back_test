import { Module } from '@nestjs/common';
import { AssetMgtService } from './asset-mgt.service';
import { AssetMgtController } from './asset-mgt.controller';
import { Asset } from './entities/asset.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset, Digifranchise]),
  ],
  providers: [AssetMgtService],
  controllers: [AssetMgtController]
})
export class AssetMgtModule {}
