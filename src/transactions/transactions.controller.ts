import { Controller, Post, Body } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateTokenDto } from './dto/transaction-token.dto';

@ApiTags('TRANSACTION')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}


  @Post('create-token')
  async createToken(@Body() createTokenDto: CreateTokenDto): Promise<any> {
    return this.transactionsService.createToken(createTokenDto);
  }

}
