import { Module } from '@nestjs/common';
import { RatingOrderService } from './rating-order.service';
import { RatingOrderController } from './rating-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderTable } from 'src/payment/entities/order.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { RatingOrderTable } from './entities/rating-order.entity';
import { OrderIssueService } from './order-issue.service';
import { OrderIssueController } from './order-issue.controller';
import { OrderComplaintsTable, OrderIssueTable } from './entities/Complaints.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        RatingOrderTable,
        UserEntity,
        OrderTable,
        OrderIssueTable,
        OrderComplaintsTable
      ]),
  ],
  providers: [RatingOrderService, OrderIssueService, ],
  controllers: [RatingOrderController, OrderIssueController, ]
})
export class RatingOrderModule {}
