import { Module } from "@nestjs/common";
import { QuotationsService } from "./quotations.service";
import { QuotationsController } from "./quotations.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuotationEntity } from "./entities/quotation.entity";
import { QuotationRequest } from "./entities/quotation-request.entity";
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";
import { DigifranchiseProduct } from "src/digifranchise/entities/digifranchise-product.entity";
import { DigifranchiseServiceOffered } from "src/digifranchise/entities/digifranchise-service-offered.entity";
import { MailModule } from "../mail/mail.module";
import { DigifranchiseServiceCategory } from "src/digifranchise/entities/digifranchise-service-category.entity";
import { DigifranchiseSubServices } from "src/digifranchise/entities/digifranchise-sub-service.entity";
import { DigifranchiseSubProduct } from "src/digifranchise/entities/digifranchise-sub-product.entity";
import { RateTable } from "src/payment/entities/tax-rate.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuotationEntity,
      QuotationRequest,
      DigifranchiseOwner,
      DigifranchiseProduct,
      DigifranchiseServiceOffered,
      DigifranchiseServiceCategory,
      DigifranchiseSubServices,
      DigifranchiseSubProduct,
      RateTable,
    ]),
    MailModule,
  ],
  providers: [QuotationsService],
  controllers: [QuotationsController],
})
export class QuotationsModule {}
