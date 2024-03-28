import { Module } from '@nestjs/common';
import { OrderController, RateController } from './digifranchise-payment.controller';
import { OrderService } from './order.service';
import { OrderBasicInfo, OrderTable } from './entities/order.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DigifranchiseProduct } from 'src/digifranchise/entities/digifranchise-product.entity';
import { RateService } from './rate.service';
import { RateTable } from './entities/tax-rate.entity';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { DigifranchiseServiceOffered } from 'src/digifranchise/entities/digifranchise-service-offered.entity';
import { DigifranchiseServiceCategory } from 'src/digifranchise/entities/digifranchise-service-category.entity';
import { OrderBasicInfoService } from './order-basic-info.service';
import { OrderBasicInfoController } from './order-basic-info.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderTable, UserEntity, DigifranchiseProduct,OrderBasicInfo, RateTable,DigifranchiseServiceCategory, DigifranchiseProduct, DigifranchiseServiceOffered, Digifranchise
    ]),
  ],
  providers: [OrderService, RateService, OrderBasicInfoService],
  controllers: [RateController, OrderController, OrderBasicInfoController]
})
export class DigifranchisePaymentModule { }
