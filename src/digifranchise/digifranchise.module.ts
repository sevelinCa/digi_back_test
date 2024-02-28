import { Module } from '@nestjs/common';
import { DigifranchiseController, DigifranchiseProductController, DigifranchiseServiceOfferedController } from './digifranchise.controller';
import { DigifranchiseService } from './digifranchise.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Digifranchise } from './entities/digifranchise.entity';
import { DigifranchiseServiceOffered } from './entities/digifranchise-service.entity';
import { DigifranchiseOwner } from './entities/digifranchise-ownership.entity';
import { DigifranchiseGeneralInfoService } from './digifranchise-general-information.service';
import { DigifranchiseGeneralInfo } from './entities/digifranchise-general-information.entity';
import { DigifranchiseSubServices } from './entities/digifranchise-sub-service.entity';
import { DigifranchiseProduct } from './entities/digifranchise-product.entity';
import { ProductService } from './product.service';
import { DigifranchiseSubProduct } from './entities/digifranchise-sub-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      DigifranchiseServiceOffered,
      DigifranchiseSubServices,
      DigifranchiseProduct,
      DigifranchiseSubProduct,
      Digifranchise,
      DigifranchiseOwner,
      DigifranchiseGeneralInfo
    ]),
  ],
  controllers: [DigifranchiseController,DigifranchiseServiceOfferedController,DigifranchiseProductController],
  providers: [DigifranchiseService, DigifranchiseGeneralInfoService, ProductService]
})
export class DigifranchiseModule {}