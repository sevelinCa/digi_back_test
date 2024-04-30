import { Module } from '@nestjs/common';
import { OrderController, RateController } from './digifranchise-payment.controller';
import { OrderService } from './order.service';
import { OrderBasicInfo, OrderTable } from './entities/order.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DigifranchiseProduct } from 'src/digifranchise/entities/digifranchise-product.entity';
import { RateService } from './rate.service';
import { RateTable } from './entities/tax-rate.entity';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { DigifranchiseServiceOffered } from 'src/digifranchise/entities/digifranchise-service-offered.entity';
import { DigifranchiseServiceCategory } from 'src/digifranchise/entities/digifranchise-service-category.entity';
import { OrderBasicInfoService } from './order-basic-info.service';
import { OrderBasicInfoController } from './order-basic-info.controller';
import { DigifranchiseSubServices } from 'src/digifranchise/entities/digifranchise-sub-service.entity';
import { DigifranchiseSubProduct } from 'src/digifranchise/entities/digifranchise-sub-product.entity';
import { DigifranchiseSubServiceCategory } from 'src/digifranchise/entities/digifranchise-sub-service-category.entity';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';
import { MailModule } from 'src/mail/mail.module';
import { SmsModule } from 'src/sms/sms.module';


@Module({
  imports: [
    MailModule,
    SmsModule,
    TypeOrmModule.forFeature([
      OrderTable,
      UserEntity,
      DigifranchiseProduct,
      OrderBasicInfo,
      RateTable,
      DigifranchiseServiceCategory,
      DigifranchiseProduct,
      DigifranchiseServiceOffered,
      Digifranchise,
      DigifranchiseSubServices,
      DigifranchiseSubProduct,
      DigifranchiseSubServiceCategory,
      DigifranchiseOwner
    ]),

  ],
  providers: [OrderService, RateService, OrderBasicInfoService],
  controllers: [RateController, OrderController, OrderBasicInfoController]
})
export class DigifranchisePaymentModule { }
