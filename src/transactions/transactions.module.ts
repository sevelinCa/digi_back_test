import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TransactionsAuthService } from "./transactions-auth.service";
import { TransactionsController } from "./transactions.controller";
import { TransactionsService } from "./transactions.service";



@Module({
  imports: [
    HttpModule,
  ],
  providers: [ TransactionsService, TransactionsAuthService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
