import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TransactionsAuthService } from "./transactions-auth.service";
import { TransactionsController } from "./transactions.controller";
import { TransactionsService } from "./transactions.service";
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderTable } from "src/payment/entities/order.entity";
import { PaystackAuthService } from "./paystack-auth.service";
import { PaystackService } from "./paystack.service";
import { PaystackController } from "./paystack.controller";

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([UserEntity, DigifranchiseOwner, OrderTable]),
  ],

  providers: [
    TransactionsService,
    TransactionsAuthService,
    PaystackAuthService,
    PaystackService,
  ],
  controllers: [TransactionsController, PaystackController],
})
export class TransactionsModule {}
