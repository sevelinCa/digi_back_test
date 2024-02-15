import { Module } from '@nestjs/common';
import { AssetMgtController } from './asset-mgt.controller';
import { AssetMgtService } from './asset-mgt.service';

@Module({
  controllers: [AssetMgtController],
  providers: [AssetMgtService]
})
export class AssetMgtModule {}
