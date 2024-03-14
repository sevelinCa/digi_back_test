import { Module } from '@nestjs/common';
import { CustomerSubscription } from './entities/customer-subscription.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerSubscriptionService } from './customer-subscription.service';
import { CustomerSubscriptionController } from './customer-subscription.controller';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        CustomerSubscription,
        UserEntity,
        Digifranchise
      ]),
  ],
  providers: [CustomerSubscriptionService],
  controllers: [CustomerSubscriptionController]
})
export class DigifranchiseSubscriptionModule { }
