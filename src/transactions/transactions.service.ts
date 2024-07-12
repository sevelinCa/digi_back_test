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
      console.log('GraphQL Response:', response);
  
      if (!response || !response.transactions || !response.transactions.data) {
        throw new Error('Invalid response structure');
      }
  
      return response.transactions.data;
    } catch (error) {
      if (error.response?.errors) {
        console.error('GraphQL Error:', error.response.errors);
        throw new Error(`GraphQL Error: ${error.response.errors[0].message}`);
      } else {
        console.error('Error:', error);
        throw new Error(`Unexpected Error: ${error.message}`);
      }
    }
  }

  async getOneTransaction(transactionId: string): Promise<any> {
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
    console.log('GraphQL Response:', response);
    return response;
  } catch (error) {
    console.error('GraphQL Error:', error.response.errors);
    throw new Error(`GraphQL Error: ${error.response.errors[0].message}`);
  }
  }


  async deleteTransaction(transactionId: string): Promise<any> {
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
      console.log('GraphQL Response:', response);
      return response.transactionDelete;
    } catch (error) {
      console.error('GraphQL Error:', error.response.errors);
      throw new Error(`GraphQL Error: ${error.response.errors[0].message}`);
    }
  }

  async getCheckoutLink(transactionId: string, paymentMethods: string[] = []): Promise<any> {
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
      mutation checkoutLink($transactionId: ID!, $paymentMethods: [DepositMethod!]) {
        checkoutLink(transactionId: $transactionId, paymentMethods: $paymentMethods)
      }
    `;
  
    const variables = {
      transactionId,
      paymentMethods,
    };
  
    try {
      const response = await client.request(mutation, variables);
      console.log('Checkout Link:', response);
      return response.checkoutLink;
    } catch (error) {
      console.error('GraphQL Error:', error.response.errors);
      throw new Error(`GraphQL Error: ${error.response.errors[0].message}`);
    }
  }


}
