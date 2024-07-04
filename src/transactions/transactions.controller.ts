import { Controller, Post, Body,Get } from '@nestjs/common';
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
}
