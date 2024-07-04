import { Injectable } from '@nestjs/common';
import { TransactionsAuthService } from './transactions-auth.service';
import { GraphQLClient, gql } from 'graphql-request';
import { CreateTokenDto } from './dto/transaction-token.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private transactionsAuthService: TransactionsAuthService,
  ) {}
  
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


}
