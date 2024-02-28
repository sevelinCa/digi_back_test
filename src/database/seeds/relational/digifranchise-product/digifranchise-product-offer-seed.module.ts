import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { DigifranchiseProductSeedService } from './digifranchise-product-seed.service';
import { DigifranchiseProduct } from 'src/digifranchise/entities/digifranchise-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Digifranchise, DigifranchiseProduct])],
  providers: [ DigifranchiseProductSeedService],
  exports: [ DigifranchiseProductSeedService],
})
export class DigifranchiseProductSeedModule {}