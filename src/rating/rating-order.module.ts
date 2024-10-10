import { Module } from "@nestjs/common";
import { RatingOrderService } from "./rating-order.service";
import { RatingOrderController } from "./rating-order.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderTable } from "src/payment/entities/order.entity";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import { RatingOrderTable } from "./entities/rating-order.entity";
import { OrderIssueService } from "./order-issue.service";
import { OrderIssueController } from "./order-issue.controller";
import {
  OrderComplaintsTable,
  OrderIssueTable,
} from "./entities/Complaints.entity";
import { OrderComplaintsService } from "./order-complaints.service";
import { OrderComplaintsController } from "./order-complaints.controller";
import { DigifranchiseSubProduct } from "src/digifranchise/entities/digifranchise-sub-product.entity";
import { DigifranchiseSubServices } from "src/digifranchise/entities/digifranchise-sub-service.entity";
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RatingOrderTable,
      UserEntity,
      OrderTable,
      OrderIssueTable,
      OrderComplaintsTable,
      DigifranchiseSubProduct,
      DigifranchiseSubServices,
      DigifranchiseOwner
    ]),
  ],
  providers: [RatingOrderService, OrderIssueService, OrderComplaintsService],
  controllers: [
    RatingOrderController,
    OrderIssueController,
    OrderComplaintsController,
  ],
})
export class RatingOrderModule {}
