import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TransactionsAuthService } from "./transactions-auth.service";



@Module({
  imports: [
    HttpModule,
  ],
  providers: [ TransactionsAuthService],
  controllers: [],
})
export class TransactionsModule {}
