import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { TransactionsAuthService } from "./transactions-auth.service";
import { GraphQLClient, gql } from "graphql-request";
import { CreateTransactionDto } from "./dto/transactions.dto";
import { CreateTokenDto } from "./dto/transaction-token.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import { Equal, Repository } from "typeorm";
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";
import { OrderTable } from "src/payment/entities/order.entity";
import { UpdatingOrderStatusDto } from "./dto/updating-order-status.dto";
import { OrderStatusUpdateMailData } from "src/mail/interfaces/mail-data.interface";
import { MailService } from "src/mail/mail.service";
import { TransactionsHelperService } from './transaction-helper.service';

@Injectable()
export class TransactionsService {
  constructor(
    private transactionsAuthService: TransactionsAuthService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(DigifranchiseOwner)
    private readonly digifranchiseOwnerRepository: Repository<DigifranchiseOwner>,
    @InjectRepository(OrderTable)
    private readonly orderRepository: Repository<OrderTable>,
    private readonly mailService: MailService,
    private readonly transactionsHelperService: TransactionsHelperService,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<any> {
    const accessToken = await this.transactionsAuthService.getAccessToken();
    
    if (!process.env.TRADE_SAFE_API_URL) {
      throw new Error("TRADE_SAFE_API_URL environment variable is not set");
    }

    const client = new GraphQLClient(process.env.TRADE_SAFE_API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const mutation = gql`
      mutation transactionCreate(
        $title: String!
        $description: String!
        $industry: Industry!
        $currency: Currency!
        $feeAllocation: FeeAllocation!
        $allocations: [CreateAllocationInput!]!
        $parties: [PartyInput!]!
      ) {
        transactionCreate(
          input: {
            title: $title
            description: $description
            industry: $industry
            currency: $currency
            feeAllocation: $feeAllocation
            allocations: { create: $allocations }
            parties: { create: $parties }
          }
        ) {
          id
          title
          createdAt
        }
      }
    `;

    const variables = {
      title: createTransactionDto.title,
      description: createTransactionDto.description,
      industry: createTransactionDto.industry,
      currency: createTransactionDto.currency,
      feeAllocation: createTransactionDto.feeAllocation,
      allocations: createTransactionDto.allocations,
      parties: createTransactionDto.parties,
    };

    try {
      const response = await client.request(mutation, variables);
      return response;
    } catch (error) {
      throw new Error(`GraphQL Error: ${error.response.errors[0].message}`);
    }
  }

  async createToken(createTokenDto: CreateTokenDto): Promise<any> {
    const accessToken = await this.transactionsAuthService.getAccessToken();
    if (!process.env.TRADE_SAFE_API_URL) {
      throw new Error("TRADE_SAFE_API_URL environment variable is not set");
    }

    const client = new GraphQLClient(process.env.TRADE_SAFE_API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const mutation = gql`
      mutation tokenCreate($input: TokenInput!) {
        tokenCreate(input: $input) {
          id
          name
        }
      }
    `;

    const variables = {
      input: createTokenDto,
    };

    return client.request(mutation, variables);
  }

  async getTokens(): Promise<any> {
    const accessToken = await this.transactionsAuthService.getAccessToken();
    if (!process.env.TRADE_SAFE_API_URL) {
      throw new Error("TRADE_SAFE_API_URL environment variable is not set");
    }

    const client = new GraphQLClient(process.env.TRADE_SAFE_API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const query = gql`
      query {
        tokens {
          data {
            id
            name
            reference
            user {
              givenName
              familyName
              email
              mobile
            }
            organization {
              name
              tradeName
              type
              registration
              taxNumber
            }
          }
        }
      }
    `;

    return client.request(query);
  }

  async getAllTransactions(): Promise<any> {
    const accessToken = await this.transactionsAuthService.getAccessToken();
    if (!process.env.TRADE_SAFE_API_URL) {
      throw new Error("TRADE_SAFE_API_URL environment variable is not set");
    }

    const client = new GraphQLClient(process.env.TRADE_SAFE_API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const query = gql`
      query transactions {
        transactions {
          data {
            id
            title
            description
            industry
            state
            createdAt
          }
        }
      }
    `;

    try {
      const response = await client.request(query);
      
      if (!response || !response.transactions || !response.transactions.data) {
        throw new Error("Invalid response structure");
      }

      return response.transactions.data;
    } catch (error) {
      if (error.response?.errors) {
                throw new Error(`GraphQL Error: ${error.response.errors[0].message}`);
      } else {
                throw new Error(`Unexpected Error: ${error.message}`);
      }
    }
  }

  async getOneTransaction(transactionId: string): Promise<any> {
    const accessToken = await this.transactionsAuthService.getAccessToken();
    if (!process.env.TRADE_SAFE_API_URL) {
      throw new Error("TRADE_SAFE_API_URL environment variable is not set");
    }

    const client = new GraphQLClient(process.env.TRADE_SAFE_API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const query = gql`
      query transaction($id: ID!) {
        transaction(id: $id) {
          id
          title
          createdAt
          parties {
            id
            name
            role
            details {
              user {
                givenName
                familyName
                email
              }
            }
          }
        }
      }
    `;

    try {
      const response = await client.request(query, { id: transactionId });
            return response;
    } catch (error) {
            throw new Error(`GraphQL Error: ${error.response.errors[0].message}`);
    }
  }

  async deleteTransaction(transactionId: string): Promise<any> {
    const accessToken = await this.transactionsAuthService.getAccessToken();

    if (!process.env.TRADE_SAFE_API_URL) {
      throw new Error("TRADE_SAFE_API_URL environment variable is not set");
    }

    const client = new GraphQLClient(process.env.TRADE_SAFE_API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const mutation = gql`
      mutation transactionDelete($id: ID!) {
        transactionDelete(id: $id) {
          id
          state
          createdAt
          updatedAt
          # Specify other fields you need
        }
      }
    `;

    const variables = {
      id: transactionId,
    };

    try {
      const response = await client.request(mutation, variables);
            return response.transactionDelete;
    } catch (error) {
            throw new Error(`GraphQL Error: ${error.response.errors[0].message}`);
    }
  }

  async processWalletDeposit(transactionId: string): Promise<any> {
    const accessToken = await this.transactionsAuthService.getAccessToken();
    if (!process.env.TRADE_SAFE_API_URL) {
      throw new Error("TRADE_SAFE_API_URL environment variable is not set");
    }

    const client = new GraphQLClient(process.env.TRADE_SAFE_API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const mutation = gql`
      mutation transactionDeposit($id: ID!) {
        transactionDeposit(id: $id, method: WALLET) {
          id
          processed
        }
      }
    `;

    const variables = {
      id: transactionId,
    };

    try {
      const response = await client.request(mutation, variables);
            return response.transactionDeposit;
    } catch (error) {
            throw new Error(`GraphQL Error: ${error.response.errors[0].message}`);
    }
  }

  async checkWalletBalance(tokenId: string): Promise<any> {
    const accessToken = await this.transactionsAuthService.getAccessToken();
    if (!process.env.TRADE_SAFE_API_URL) {
      throw new Error("TRADE_SAFE_API_URL environment variable is not set");
    }

    const client = new GraphQLClient(process.env.TRADE_SAFE_API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const query = gql`
      query token($id: ID!) {
        token(id: $id) {
          id
          name
          reference
          balance
          user {
            givenName
            familyName
            email
            mobile
          }
        }
      }
    `;

    const variables = {
      id: tokenId,
    };

    try {
      const response = await client.request(query, variables);
      return response.token;
    } catch (error) {
      throw new Error(`GraphQL Error: ${error.response.errors[0].message}`);
    }
  }

  async requestWithdrawal(tokenId: string, value: number): Promise<boolean> {
    const accessToken = await this.transactionsAuthService.getAccessToken();
    if (!process.env.TRADE_SAFE_API_URL) {
      throw new Error("TRADE_SAFE_API_URL environment variable is not set");
    }

    const client = new GraphQLClient(process.env.TRADE_SAFE_API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const mutation = gql`
      mutation tokenAccountWithdraw($id: ID!, $value: Float!) {
        tokenAccountWithdraw(id: $id, value: $value)
      }
    `;

    const variables = {
      id: tokenId,
      value: value,
    };

    try {
      const response = await client.request(mutation, variables);
      return response.tokenAccountWithdraw === true;
    } catch (error) {
            throw new Error(`GraphQL Error: ${error.response.errors[0].message}`);
    }
  }

  async createTransactionBuyerToken(orderId: string): Promise<any> {
    const tradeSafeApiUrl = process.env.TRADE_SAFE_API_URL;
    if (!tradeSafeApiUrl) {
      throw new Error("TRADE_SAFE_API_URL environment variable is not set");
    }
  
    const accessToken = await this.transactionsAuthService.getAccessToken();
  
    const basicInfo = await this.transactionsHelperService.getOrderBasicInfo(orderId);
  
    const { name, email, phoneNumber } = basicInfo;
    const [givenName, familyName] = name.includes(" ")
      ? name.split(" ")
      : [name, ""];
  
    const client = new GraphQLClient(tradeSafeApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    const mutation = gql`
      mutation tokenCreate($input: TokenInput!) {
        tokenCreate(input: $input) {
          id
          name
        }
      }
    `;
  
    const variables = {
      input: {
        user: {
          givenName,
          familyName,
          email,
          mobile: phoneNumber,
        },
        bankAccount: {
          accountNumber: process.env.DEFAULT_ACCOUNT_NUMBER || "0000000000",
          accountType: "CHEQUE",
          bank: "SBSA",
        },
        settings: {
          payout: {
            interval: "IMMEDIATE",
            refund: "WALLET",
          },
        },
      },
    };
  
    try {
      const response = await client.request(mutation, variables);
      return response;
    } catch (error) {
            if (error.response?.errors) {
                throw new Error(
          `Failed to create buyer token: ${error.response.errors[0].message}`,
        );
      } else {
                throw new Error("Failed to create buyer token");
      }
  }
  }
  async getDigifranchiseOwnerInfo(franchiseOwnerId: string): Promise<any> {
    const franchiseOwner = await this.digifranchiseOwnerRepository.findOne({
      where: { id: franchiseOwnerId },
      relations: ["userId"],
    });
    if (!franchiseOwner || !franchiseOwner.userId) {
      throw new NotFoundException(
        "Franchise owner or associated user not found",
      );
    }

    const userResult = await this.userRepository.manager.query(
      `SELECT "firstName", "lastName", "email", "phoneNumber" FROM "user" WHERE "id" = $1`,
      [franchiseOwner.userId.id],
    );

    if (!userResult.length) {
      throw new NotFoundException("User not found");
    }
    return {
      firstname: userResult[0].firstname,
      lastname: userResult[0].lastname,
      email: userResult[0].email,
      phoneNumber: userResult[0].phonenumber,
    };
  }

  async createTransactionSellerToken(franchiseOwnerId: string): Promise<any> {
    const accessToken = await this.transactionsAuthService.getAccessToken();
    if (!process.env.TRADE_SAFE_API_URL) {
      throw new Error("TRADE_SAFE_API_URL environment variable is not set");
    }

    const franchiseOwner = await this.digifranchiseOwnerRepository.findOne({
      where: { id: franchiseOwnerId },
      relations: ["digifranchise"],
    });
    if (!franchiseOwner) {
      throw new NotFoundException("Franchise owner not found");
    }

    const client = new GraphQLClient(process.env.TRADE_SAFE_API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const getFranchiseOwnerInfo =
      await this.getDigifranchiseOwnerInfo(franchiseOwnerId);

    const mutation = gql`
      mutation tokenCreate($input: TokenInput!) {
        tokenCreate(input: $input) {
          id
          name
        }
      }
    `;

    const variables = {
      input: {
        user: {
          givenName: getFranchiseOwnerInfo.firstName,
          familyName: getFranchiseOwnerInfo.lastName,
          email: getFranchiseOwnerInfo.email,
          mobile: getFranchiseOwnerInfo.phoneNumber,
        },
        organization: {
          name: franchiseOwner.digifranchise.digifranchiseName,
          tradeName: franchiseOwner.digifranchise.digifranchiseName,
          type: "PRIVATE",
          registrationNumber:franchiseOwner.id,
          taxNumber: process.env.DEFAULT_TAX_NUMBER || "000000000",
        },
        bankAccount: {
          accountNumber: process.env.DEFAULT_ACCOUNT_NUMBER || "0000000000",
          accountType: "CHEQUE",
          bank: "SBSA",
        },
        settings: {
          payout: {
            interval: "IMMEDIATE",
            refund: "WALLET",
          },
        },
      },
    };

    try {
      return await client.request(mutation, variables);
    } catch (error) {
            throw new Error("Failed to create seller token");
    }
  }

  async createTransactionWithAuth(
    userId: string,
    orderId: string,
  ): Promise<any> {
    const accessToken = await this.transactionsAuthService.getAccessToken();
    if (!process.env.TRADE_SAFE_API_URL) {
      throw new Error("TRADE_SAFE_API_URL environment variable is not set");
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: [
        "serviceId",
        "ownedDigifranchise",
        "ownedDigifranchise.digifranchise",
      ],
    });
    if (!order || !order.ownedDigifranchise) {
      throw new NotFoundException("Order or ownedDigifranchise not found");
    }

    let totalAmount;
    if (typeof order.totalAmount === "string") {
      totalAmount = parseFloat(order.totalAmount);
    } else {
      totalAmount = order.totalAmount;
    }

    const buyerTokenResponse = await this.createTransactionBuyerToken(order.id);
    const buyerTokenId = buyerTokenResponse.tokenCreate.id;

    const sellerTokenResponse = await this.createTransactionSellerToken(
      order.ownedDigifranchise.id,
    );
    const sellerTokenId = sellerTokenResponse.tokenCreate.id;

    const client = new GraphQLClient(process.env.TRADE_SAFE_API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const mutation = gql`
      mutation createTransaction($input: CreateTransactionInput!) {
        transactionCreate(input: $input) {
          id
          title
          createdAt
        }
      }
    `;

    const variables = {
      input: {
        title: order.ownedDigifranchise.digifranchise?.digifranchiseName,
        description: order.ownedDigifranchise.digifranchise?.description,
        industry: "GENERAL_GOODS_SERVICES",
        currency: "ZAR",
        feeAllocation: "SELLER",
        reference: order.id,
        allocations: {
          create: [
            {
              title: order.serviceId?.serviceName,
              description: order.serviceId?.description,
              value: totalAmount,
              daysToDeliver: 7,
              daysToInspect: 7,
            },
          ],
        },
        parties: {
          create: [
            {
              token: buyerTokenId,
              role: "BUYER",
            },
            {
              token: sellerTokenId,
              role: "SELLER",
            },
          ],
        },
      },
    };

    try {
      const response = await client.request(mutation, variables);
      return response;
    } catch (error) {
            throw new Error(`GraphQL Error: ${error.response.errors[0].message}`);
    }
  }


  async createTransactionWithoutAuth(orderId: string): Promise<any> {
    const accessToken = await this.transactionsAuthService.getAccessToken();
    if (!process.env.TRADE_SAFE_API_URL) {
      throw new Error("TRADE_SAFE_API_URL environment variable is not set");
    }
  
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: [
        "serviceId",
        "ownedDigifranchise",
        "ownedDigifranchise.digifranchise",
      ],
    });
    if (!order || !order.ownedDigifranchise) {
      throw new NotFoundException("Order or ownedDigifranchise not found");
    }
  
    let totalAmount;
    if (typeof order.totalAmount === "string") {
      totalAmount = parseFloat(order.totalAmount);
    } else {
      totalAmount = order.totalAmount;
    }
  
    const basicInfo = await this.transactionsHelperService.getOrderBasicInfo(orderId);
    const redirectUrl = basicInfo.redirectUrl;
    const referanceData = `${order.id}///${redirectUrl}`;
  
    const buyerTokenResponse = await this.createTransactionBuyerToken(order.id);
    const buyerTokenId = buyerTokenResponse.tokenCreate.id;
  
    const sellerTokenResponse = await this.createTransactionSellerToken(
      order.ownedDigifranchise.id,
    );
    const sellerTokenId = sellerTokenResponse.tokenCreate.id;
  
    const client = new GraphQLClient(process.env.TRADE_SAFE_API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    const mutation = gql`
      mutation createTransaction($input: CreateTransactionInput!) {
        transactionCreate(input: $input) {
          id
          title
          createdAt
        }
      }
    `;
  
    const variables = {
      input: {
        title: order.ownedDigifranchise.digifranchise?.digifranchiseName,
        description: order.ownedDigifranchise.digifranchise?.description,
        industry: "GENERAL_GOODS_SERVICES",
        currency: "ZAR",
        feeAllocation: "SELLER",
        reference: referanceData,
      
        allocations: {
          create: [
            {
              title: order.serviceId?.serviceName,
              description: order.serviceId?.description,
              value: totalAmount,
              daysToDeliver: 7,
              daysToInspect: 7,
            },
          ],
        },
        parties: {
          create: [
            {
              token: buyerTokenId,
              role: "BUYER",
            },
            {
              token: sellerTokenId,
              role: "SELLER",
            },
          ],
        },
      },
    };
  
    try {
      const response = await client.request(mutation, variables);
      return response;
    } catch (error) {
            throw new Error(`GraphQL Error: ${error.response.errors[0].message}`);
    }
  }

  async getCheckoutLink(
    transactionId: string,
    paymentMethods: string[] = [],
  ): Promise<any> {
    const accessToken = await this.transactionsAuthService.getAccessToken();
    if (!process.env.TRADE_SAFE_API_URL) {
      throw new Error("TRADE_SAFE_API_URL environment variable is not set");
    }

    const client = new GraphQLClient(process.env.TRADE_SAFE_API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const mutation = gql`
      mutation checkoutLink(
        $transactionId: ID!
        $paymentMethods: [DepositMethod!]
      ) {
        checkoutLink(
          transactionId: $transactionId
          paymentMethods: $paymentMethods
        )
      }
    `;

    const variables = {
      transactionId,
      paymentMethods,
    };

    try {
      const response = await client.request(mutation, variables);
            return response.checkoutLink;
    } catch (error) {
            throw new Error(`GraphQL Error: ${error.response.errors[0].message}`);
    }
  }



  
  

  
  async createTransactionAndGetCheckoutLink(orderId: string): Promise<any> {
    try {
      const transactionResponse =
        await this.createTransactionWithoutAuth(orderId);

      if (
        !transactionResponse ||
        !transactionResponse.transactionCreate ||
        !transactionResponse.transactionCreate.id
      ) {
        throw new BadRequestException(
          "Failed to create transaction or transaction ID not found.",
        );
      }

      const transactionId = transactionResponse.transactionCreate.id;
      const title = transactionResponse.transactionCreate.title;
      const createdAt = transactionResponse.transactionCreate.createdAt;

      const checkoutLink = await this.getCheckoutLink(transactionId);

      return {
        transactionCreate: {
          id: transactionId,
          title,
          createdAt,
        },
        checkoutLink,
      };
    } catch (error) {
      throw error;
    }
  }

  async getSellerToken(registrationNumber: string): Promise<any> {
    const accessToken = await this.transactionsAuthService.getAccessToken();
    if (!process.env.TRADE_SAFE_API_URL) {
      throw new Error("TRADE_SAFE_API_URL environment variable is not set");
    }
  
    const client = new GraphQLClient(process.env.TRADE_SAFE_API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    const query = gql`
      query {
        tokens {
          data {
            id
            name
            reference
            user {
              givenName
              familyName
              email
              mobile
            }
            organization {
              name
              tradeName
              type
              registration
              taxNumber
            }
          }
        }
      }
    `;
  
    const response = await client.request(query);
    const filteredData = response.tokens.data.filter(item => item.organization !== null);
    return filteredData.find(token => token.organization.registration === registrationNumber) || null;
  }

  async getTokenBalance(tokenId: string): Promise<any> {
    const accessToken = await this.transactionsAuthService.getAccessToken();
    if (!process.env.TRADE_SAFE_API_URL) {
      throw new Error("TRADE_SAFE_API_URL environment variable is not set");
    }
  
    const client = new GraphQLClient(process.env.TRADE_SAFE_API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    const query = gql`
      query token($id: ID!) {
        token(id: $id) {
          id
          name
          reference
          balance
          user {
            givenName
            familyName
            email
            mobile
          }
        }
      }
    `;
  
    const variables = {
      id: tokenId,
    };
  
    try {
      const response = await client.request(query, variables);
      console.log('Raw GraphQL Response:', JSON.stringify(response, null, 2)); // Log the raw response
      return response.token;
    } catch (error) {
      console.error('GraphQL Error:', error.response ? error.response.errors : error.message);
      throw new Error(`GraphQL Error: ${error.response.errors[0].message}`);
    }
  }

  async updateTokenSettings(tokenId: string, payoutInterval: string, refundMethod: string): Promise<any> {
    const accessToken = await this.transactionsAuthService.getAccessToken();
    if (!process.env.TRADE_SAFE_API_URL) {
      throw new Error("TRADE_SAFE_API_URL environment variable is not set");
    }
  
    const client = new GraphQLClient(process.env.TRADE_SAFE_API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    const mutation = gql`
      mutation tokenUpdate($id: ID!, $input: TokenUpdateInput!) {
        tokenUpdate(id: $id, input: $input) {
          id
          name
          settings {
            payout {
              interval
              refund
            }
          }
        }
      }
    `;
  
    const variables = {
      id: tokenId,
      input: {
        settings: {
          payout: {
            interval: payoutInterval,
            refund: refundMethod,
          },
        },
      },
    };
  
    try {
      const response = await client.request(mutation, variables);
      return response.tokenUpdate;
    } catch (error) {
      throw new Error(`GraphQL Error: ${error.response.errors[0].message}`);
    }
  }

  async requestOfWithdrawal(tokenId: string, value: number): Promise<boolean> {
    const accessToken = await this.transactionsAuthService.getAccessToken();
    if (!process.env.TRADE_SAFE_API_URL) {
      throw new Error("TRADE_SAFE_API_URL environment variable is not set");
    }
  
    const client = new GraphQLClient(process.env.TRADE_SAFE_API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    const mutation = gql`
      mutation tokenAccountWithdraw($id: ID!, $value: Float!) {
        tokenAccountWithdraw(id: $id, value: $value)
      }
    `;
  
    const variables = {
      id: tokenId,
      value: value,
    };
  
    try {
      const response = await client.request(mutation, variables);
      return response.tokenAccountWithdraw === true;
    } catch (error) {
      throw new Error(`GraphQL Error: ${error.response.errors[0].message}`);
    }
  }


}
