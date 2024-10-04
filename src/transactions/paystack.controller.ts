import { Controller, Post, Body, HttpException, HttpStatus, Param, Get, Req, UseGuards } from '@nestjs/common';
import { PaystackService } from './paystack.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePayStackSubAccountDTO, CreatePayStackTransactionCallbackUrlDTO, CreatePayStackTransactionDTO,  } from './dto/paystack.dto';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Request } from "express";
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';

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

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Post('create-transaction-with-auth/:orderId')
  async createPaystackTransactionWithAuth(
    @Req() req: Request,
    @Param("orderId") orderId: string,
    @Body() paystackDto: CreatePayStackTransactionCallbackUrlDTO): Promise<any> {
      const userId = (req.user as UserEntity).id;

    try {
      const result = await this.paystackService.createPaystackTransactionWithAuth(userId, orderId, paystackDto);
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


  @Post('subaccount')
  async createSubAccount(@Body() dto: CreatePayStackSubAccountDTO) {
    try {
      const result = await this.paystackService.createSubAccount(dto);
      return {
        status: true,
        message: 'Subaccount created successfully',
        data: result.data,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create subAccount',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }



  
}