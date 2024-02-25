import { Module } from '@nestjs/common';
import { AssetMgtService } from './asset-mgt.service';
import { AssetMgtController } from './asset-mgt.controller';
import { Asset } from './entities/asset.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FranchiseOwnership } from 'src/digifranchise/entities/franchise-ownership.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Asset, FranchiseOwnership]),
  ],
  providers: [AssetMgtService],
  controllers: [AssetMgtController]
})
export class AssetMgtModule {}
