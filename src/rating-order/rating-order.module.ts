import { Module } from '@nestjs/common';
import { RatingOrderService } from './rating-order.service';
import { RatingOrderController } from './rating-order.controller';

@Module({
  providers: [RatingOrderService],
  controllers: [RatingOrderController]
})
export class RatingOrderModule {}
