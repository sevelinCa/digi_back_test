import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  Req,
} from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { CreateTransactionDto } from "./dto/transactions.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateTokenDto } from "./dto/transaction-token.dto";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/roles/roles.guard";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import { Request } from "express";

@ApiTags("TRANSACTION")
@Controller("transactions")
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post("create-transaction")
  async create(
    @Body() createTransactionDto: CreateTransactionDto
  ): Promise<any> {
    return this.transactionsService.createTransaction(createTransactionDto);
  }

  @Post("create-token")
  async createToken(@Body() createTokenDto: CreateTokenDto): Promise<any> {
    return this.transactionsService.createToken(createTokenDto);
  }

  @Get("tokens")
  async getTokens(): Promise<any> {
    return this.transactionsService.getTokens();
  }

  @Get("getAllTransaction")
  async getAllTransactions(): Promise<any> {
    return this.transactionsService.getAllTransactions();
  }

  @Get("getOnTransaction/:id")
  async getOneTransaction(@Param("id") transactionId: string): Promise<any> {
    return this.transactionsService.getOneTransaction(transactionId);
  }

  @Delete("delete-transaction/:id")
  async deleteTransaction(@Param("id") transactionId: string): Promise<any> {
    return this.transactionsService.deleteTransaction(transactionId);
  }

  @Post("process-wallet-deposit/:transactionId")
  async processWalletDeposit(
    @Param("transactionId") transactionId: string
  ): Promise<any> {
    return this.transactionsService.processWalletDeposit(transactionId);
  }

  @Get("check-wallet-balance/:tokenId")
  async checkWalletBalance(@Param("tokenId") tokenId: string): Promise<any> {
    return this.transactionsService.checkWalletBalance(tokenId);
  }

  @Post("request-withdrawal/:tokenId")
  async requestWithdrawal(
    @Param("tokenId") tokenId: string,
    @Body("value") value: number
  ): Promise<boolean> {
    return this.transactionsService.requestWithdrawal(tokenId, value);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Post("create-buy-token")
  async createTransactionBuyerToken(@Req() req: Request): Promise<any> {
    const userId = (req.user as UserEntity).id;

    return this.transactionsService.createTransactionBuyerToken(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Post("create-seller-token/:franchiseOwnerId")
  async createTransactionSellerToken(
    @Req() req: Request,
    @Param("franchiseOwnerId") franchiseOwnerId: string
  ): Promise<any> {
    return this.transactionsService.createTransactionSellerToken(
      franchiseOwnerId
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard("jwt"), RolesGuard)
  @Post("create-transaction-with-auth/:orderId")
  async createTransactionWithAuth(
    @Req() req: Request,
    @Param("orderId") orderId: string
  ): Promise<any> {
    const userId = (req.user as UserEntity).id;

    return this.transactionsService.createTransactionWithAuth(userId, orderId);
  }

  @Post("checkout-link/:transactionId")
  async getCheckoutLink(
    @Param("transactionId") transactionId: string,
    @Body("paymentMethods") paymentMethods: string[]
  ): Promise<string> {
    const checkoutLink = await this.transactionsService.getCheckoutLink(
      transactionId,
      paymentMethods
    );
    return checkoutLink;
  }
}
