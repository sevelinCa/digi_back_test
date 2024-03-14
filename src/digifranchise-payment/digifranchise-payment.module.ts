import { Module } from '@nestjs/common';
import { OrderController } from './digifranchise-payment.controller';
import { OrderService } from './order.service';
import { OrderTable } from './entities/order.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DigifranchiseProduct } from 'src/digifranchise/entities/digifranchise-product.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderTable, UserEntity, DigifranchiseProduct
    ]),
  ],
  providers: [OrderService],
  controllers: [OrderController]
})
export class DigifranchisePaymentModule { }
