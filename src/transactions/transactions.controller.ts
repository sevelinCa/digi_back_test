import { Controller, Post, Body,Get, Param, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/transactions.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateTokenDto } from './dto/transaction-token.dto';

@ApiTags('TRANSACTION')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}
  
  @Post('create-transaction')
  async create(@Body() createTransactionDto: CreateTransactionDto): Promise<any> {
    return this.transactionsService.createTransaction(createTransactionDto);
  }

  @Post('create-token')
  async createToken(@Body() createTokenDto: CreateTokenDto): Promise<any> {
    return this.transactionsService.createToken(createTokenDto);
  }

  @Get('tokens')
  async getTokens(): Promise<any> {
    return this.transactionsService.getTokens();
  }

  @Get('getAllTransaction')
  async getAllTransactions(): Promise<any> {
    return this.transactionsService.getAllTransactions();
  }

  @Get('getOnTransaction/:id')
  async getOneTransaction(@Param('id') transactionId: string): Promise<any> {
    return this.transactionsService.getOneTransaction(transactionId);
  }

  @Delete('delete-transaction/:id')
  async deleteTransaction(@Param('id') transactionId: string): Promise<any> {
    return this.transactionsService.deleteTransaction(transactionId);
  }

  @Post('checkout-link/:transactionId')
  async getCheckoutLink(@Param('transactionId') transactionId: string, @Body('paymentMethods') paymentMethods: string[]): Promise<string> {
    const checkoutLink = await this.transactionsService.getCheckoutLink(transactionId, paymentMethods);
    return checkoutLink;
  }



}
