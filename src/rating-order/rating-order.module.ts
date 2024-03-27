import { Module } from '@nestjs/common';
import { RatingOrderService } from './rating-order.service';
import { RatingOrderController } from './rating-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderTable } from 'src/payment/entities/order.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { RatingOrderTable } from './entities/rating-order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        RatingOrderTable,
        UserEntity,
        OrderTable,
      ]),
  ],
  providers: [RatingOrderService],
  controllers: [RatingOrderController]
})
export class RatingOrderModule {}
