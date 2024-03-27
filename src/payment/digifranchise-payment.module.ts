import { Module } from '@nestjs/common';
import { OrderController, RateController } from './digifranchise-payment.controller';
import { OrderService } from './order.service';
import { OrderTable } from './entities/order.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DigifranchiseProduct } from 'src/digifranchise/entities/digifranchise-product.entity';
import { RateService } from './rate.service';
import { RateTable } from './entities/tax-rate.entity';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { DigifranchiseServiceOffered } from 'src/digifranchise/entities/digifranchise-service-offered.entity';
import { DigifranchiseServiceCategory } from 'src/digifranchise/entities/digifranchise-service-category.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderTable, UserEntity, DigifranchiseProduct, RateTable,DigifranchiseServiceCategory, DigifranchiseProduct, DigifranchiseServiceOffered, Digifranchise
    ]),
  ],
  providers: [OrderService, RateService],
  controllers: [RateController, OrderController]
})
export class DigifranchisePaymentModule { }
