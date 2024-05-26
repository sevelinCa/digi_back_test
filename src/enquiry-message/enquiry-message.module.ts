import { Module } from "@nestjs/common";
import { EnquiryMessageService } from "./enquiry-message.service";
import { EnquiryMessageController } from "./enquiry-message.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";
import { EnquiriesTable } from "./entities/enquiries.entity";

@Module({
  imports: [TypeOrmModule.forFeature([EnquiriesTable, DigifranchiseOwner])],
  providers: [EnquiryMessageService],
  controllers: [EnquiryMessageController],
})
export class EnquiryMessageModule {}
