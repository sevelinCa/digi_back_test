import { Controller, Post, Body,Get, Param, Delete } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/transactions.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateTokenDto } from './dto/transaction-token.dto';
import { CreateDepositDto } from './dto/deposit.dto';

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

  @Post('create-deposit')
  async createDeposit(@Body() createDepositDto: CreateDepositDto): Promise<any> {
    return this.transactionsService.createDeposit(createDepositDto);
  }

  @Delete('delete-transaction/:id')
  async deleteTransaction(@Param('id') transactionId: string): Promise<any> {
    return this.transactionsService.deleteTransaction(transactionId);
  }
}
