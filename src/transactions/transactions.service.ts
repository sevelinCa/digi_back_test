import { Injectable } from '@nestjs/common';
import { TransactionsAuthService } from './transactions-auth.service';
import { GraphQLClient, gql } from 'graphql-request';
import { CreateTransactionDto } from './dto/transactions.dto';
import { CreateTokenDto } from './dto/transaction-token.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private transactionsAuthService: TransactionsAuthService,
  ) {}
  

  async createTransaction(createTransactionDto: CreateTransactionDto): Promise<any> {
    const accessToken = await this.transactionsAuthService.getAccessToken();
    console.log('Access Token:', accessToken);

    if (!process.env.TRADE_SAFE_API_URL) {
      throw new Error('TRADE_SAFE_API_URL environment variable is not set');
    }

    const client = new GraphQLClient(process.env.TRADE_SAFE_API_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const mutation = gql`
      mutation transactionCreate(
        $title: String!,
        $description: String!,
        $industry: Industry!,
        $currency: Currency!,
        $feeAllocation: FeeAllocation!,
        $allocations: [CreateAllocationInput!]!,
        $parties: [PartyInput!]!
      ) {
        transactionCreate(input: {
          title: $title,
          description: $description,
          industry: $industry,
          currency: $currency,
          feeAllocation: $feeAllocation,
          allocations: { create: $allocations },
          parties: { create: $parties }
        }) {
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

    console.log('Request Variables:', variables);

    try {
      const response = await client.request(mutation, variables);
      console.log('GraphQL Response:', response);
      return response;
    } catch (error) {
      console.error('GraphQL Error:', error.response.errors);
      throw new Error(`GraphQL Error: ${error.response.errors[0].message}`);
    }
  }


  async createToken(createTokenDto: CreateTokenDto): Promise<any> {
    const accessToken = await this.transactionsAuthService.getAccessToken();
    if (!process.env.TRADE_SAFE_API_URL) {
      throw new Error('TRADE_SAFE_API_URL environment variable is not set');
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
      throw new Error('TRADE_SAFE_API_URL environment variable is not set');
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
      throw new Error('TRADE_SAFE_API_URL environment variable is not set');
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
      console.log('GraphQL Response:', response);
      return response;
    } catch (error) {
      console.error('GraphQL Error:', error.response.errors);
      throw new Error(`GraphQL Error: ${error.response.errors[0].message}`);
    }
  }


}
