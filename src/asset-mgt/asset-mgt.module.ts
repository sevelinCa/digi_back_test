import { Module } from '@nestjs/common';
import { AssetMgtController } from './asset-mgt.controller';
import { AssetMgtService } from './asset-mgt.service';
import { Asset } from './entities/asset.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DigifranchiseAccount } from 'src/digifranchise/entities/digifranchise-account.entity';
import { User } from 'src/users/domain/user';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Asset,
      DigifranchiseAccount,
      User,

    ]),
  ],
  controllers: [AssetMgtController],
  providers: [AssetMgtService]
})
export class AssetMgtModule { }
