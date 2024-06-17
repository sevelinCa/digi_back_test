import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderTable } from "src/payment/entities/order.entity";
import { OrderSeedService } from "./order-seeds.service";

@Module({
  imports: [TypeOrmModule.forFeature([OrderTable])],
  providers: [OrderSeedService],
  exports: [OrderSeedService],
})
export class OrderSeedModule {}
