import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { CreateTransactionDto } from "./dto/transactions.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateTokenDto } from "./dto/transaction-token.dto";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/roles/roles.guard";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import { Request } from "express";
import { UpdatingOrderStatusDto } from "./dto/updating-order-status.dto";
import { TransactionsHelperService } from "./transaction-helper.service";
import { UpdateTokenSettingsDto } from "./dto/update-token-settings.dto";

@ApiTags("TRANSACTION")
@Controller("transactions")
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly transactionsHelperService: TransactionsHelperService
  ) {}

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

  @Post("create-buy-token/:orderId")
  async createTransactionBuyerToken(
    @Param("orderId") orderId: string
  ): Promise<any> {
    return this.transactionsService.createTransactionBuyerToken(orderId);
  }

  @Post("create-seller-token/:franchiseOwnerId")
  async createTransactionSellerToken(
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

  @Post("create-transaction-without-auth/:orderId")
  async createTransactionWithoutAuth(
    @Param("orderId") orderId: string
  ): Promise<any> {
    return this.transactionsService.createTransactionWithoutAuth(orderId);
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

  @Put("update-order-status/:orderId")
  async updateOrderStatusAndNotifyCustomerByEmail(
    @Param("orderId") orderId: string,
    @Body() updatingOrderStatusDto: UpdatingOrderStatusDto
  ): Promise<any> {
    return this.transactionsService.updateOrderStatusAndNotifyCustomerByEmail(
      orderId,
      updatingOrderStatusDto
    );
  }

  @Post("create-transaction-and-checkout-link/:orderId")
  async createTransactionAndGetCheckoutLink(
    @Param("orderId") orderId: string
  ): Promise<any> {
    return await this.transactionsService.createTransactionAndGetCheckoutLink(
      orderId
    );
  }

  @Get("get-franchiseOwner-id/:orderId")
  async getOwnedFranchise(@Param("orderId") orderId: string) {
    return this.transactionsHelperService.getOwnedFranchise(orderId);
  }


  @Get("get-seller-token/:ownerId")
  async getSellerToken(@Param("ownerId") ownerId: string): Promise<any> {
    return this.transactionsService.getSellerToken(ownerId);
  }


  
  @Get("get-seller-balance/:tokenId")
  async getTokenBalance(@Param("tokenId") tokenId: string): Promise<any> {
    const balance = await this.transactionsService.getTokenBalance(tokenId);
    console.log('Balance:', balance);
    return balance;
  }

  @Put("update-seller-token-settings/:tokenId")
  async updateTokenSettings(
    @Param("tokenId") tokenId: string,
    @Body() updateSettingsDto: UpdateTokenSettingsDto
  ): Promise<any> {
    const { payoutInterval, refundMethod } = updateSettingsDto;
    return this.transactionsService.updateTokenSettings(
      tokenId,
      payoutInterval,
      refundMethod
    );
  }

  @Post("request-withdrawal/:tokenId")
  async requestOfWithdrawal(
    @Param("tokenId") tokenId: string,
    @Body("value") value: number
  ): Promise<boolean> {
    return this.transactionsService.requestOfWithdrawal(tokenId, value);
  }
}
