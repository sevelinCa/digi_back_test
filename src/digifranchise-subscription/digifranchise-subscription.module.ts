import { Module } from "@nestjs/common";
import { CustomerSubscription } from "./entities/customer-subscription.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerSubscriptionService } from "./customer-subscription.service";
import { CustomerSubscriptionController } from "./customer-subscription.controller";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import { Digifranchise } from "src/digifranchise/entities/digifranchise.entity";
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerSubscription,
      UserEntity,
      Digifranchise,
      DigifranchiseOwner,
    ]),
  ],
  providers: [CustomerSubscriptionService],
  controllers: [CustomerSubscriptionController],
})
export class DigifranchiseSubscriptionModule {}
