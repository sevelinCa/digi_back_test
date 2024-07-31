import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  HttpStatus,
} from "@nestjs/common";
import { PaystackService } from "./paystack.service";
import { CreatePayStackTransactionDTO } from "./dto/paystack.dto"; // Ensure this import matches the location of your DTO file
import { Response } from "express";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("PAY STACK")
@Controller("paystack")
export class PaystackController {
  constructor(private readonly paystackService: PaystackService) {}

  @Post("initialize")
  async initializeTransaction(
    @Body() createPayStackTransactionDto: CreatePayStackTransactionDTO,
  ) {
    try {
      const response = await this.paystackService.initializeTransaction(
        createPayStackTransactionDto,
      );
      return response;
    } catch (error) {
      console.error(error);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "Failed to initialize transaction",
      };
    }
  }

}
