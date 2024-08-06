import { Controller, Post, Body, HttpException, HttpStatus, Param, Get } from '@nestjs/common';
import { PaystackService } from './paystack.service';
import { ApiTags } from '@nestjs/swagger';
import { CreatePayStackTransactionCallbackUrlDTO, CreatePayStackTransactionDTO } from './dto/paystack.dto';

@ApiTags('PAYSTACK')
@Controller('transaction')
export class PaystackController {
  constructor(private readonly paystackService: PaystackService) {}

  @Post('create-transaction')
  async createTransaction(@Body() dto: CreatePayStackTransactionDTO) {
    try {
      const result = await this.paystackService.createTransaction(dto);
      return {
        status: true,
        message: 'Transaction created successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create transaction',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  @Get('verify-transaction/:referenceId')
  async verifyTransaction(@Param('referenceId') referenceId: string) {
    try {
      const result = await this.paystackService.verifyTransaction(referenceId);
      return {
        status: true,
        message: 'Transaction verified successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to verify transaction',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  @Get('all-transactions')
  async getAllTransactions() {
    return this.paystackService.getAllTransactions();
  }

  @Get('transaction-by-reference/:reference')
  async getTransactionByReference(@Param('reference') reference: string) {
    return this.paystackService.getTransactionByReference(reference);
  }

  @Get('abandoned-references')
  async getAllAbandonedTransactionReferences() {
    try {
      const references = await this.paystackService.getAllAbandonedTransactionReferences();
      return {
        status: true,
        message: 'Successfully retrieved abandoned transaction references.',
        data: references,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to retrieve abandoned transaction references.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('create-transaction-without-auth/:orderId')
  async createPaystackTransactionWithoutAuth(
    @Param("orderId") orderId: string,
    @Body() paystackDto: CreatePayStackTransactionCallbackUrlDTO): Promise<any> {
    try {
      const result = await this.paystackService.createPaystackTransactionWithoutAuth(orderId, paystackDto);
      return {
        status: true,
        message: 'Transaction created successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create transaction',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
}