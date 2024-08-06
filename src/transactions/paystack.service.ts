import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { CreatePayStackTransactionCallbackUrlDTO, CreatePayStackTransactionDTO } from './dto/paystack.dto';
import { lastValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderTable } from 'src/payment/entities/order.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class PaystackService {
  private readonly paystackUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(OrderTable)
    private readonly orderRepository: Repository<OrderTable>,
  ) {
    this.paystackUrl = this.configService.get<string>('PAYSTACK_API_URL') || '';
  }

  async createTransaction(dto: CreatePayStackTransactionDTO) {
    const koboAmount = this.configService.get<number>('KOBO_AMOUNT') || 100;
    dto.amount *= koboAmount;
  
    const url = `${this.paystackUrl}/transaction/initialize`;
    const callbackUrl = this.configService.get<string>('PAYSTACK_CALLBACK_URL');
    const headers = {
      Authorization: `Bearer ${this.configService.get<string>('PAYSTACK_SECRET_KEY')}`,
      'Content-Type': 'application/json',
    };
  
    try {
      const response = await lastValueFrom(
        this.httpService.post(url, { ...dto, callback: callbackUrl }, { headers })
      );
      const transactionDetails = {
        ...response?.data,
        callbackUrl: callbackUrl,
      };
      return transactionDetails;
    } catch (error) {
      throw new Error(`Failed to create Paystack transaction: ${error.message}`);
    }
  }
  async verifyTransaction(referenceId: string) {
    const url = `${this.paystackUrl}/transaction/verify/${referenceId}`;
    const headers = {
      Authorization: `Bearer ${this.configService.get<string>('PAYSTACK_SECRET_KEY')}`,
      'Content-Type': 'application/json',
    };
  
    try {
      const response = await lastValueFrom(this.httpService.get(url, { headers }));
      return response?.data;
    } catch (error) {
      throw new Error(`Failed to verify Paystack transaction: ${error.message}`);
    }
  }

  async getAllTransactions() {
    const url = `${this.paystackUrl}/transaction`;
    const headers = {
      Authorization: `Bearer ${this.configService.get<string>('PAYSTACK_SECRET_KEY')}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await this.httpService.get(url, { headers }).toPromise();
      return response?.data;
    } catch (error) {
      throw new Error(`Failed to get Paystack transactions: ${error.message}`);
    }
  }

  async getTransactionByReference(reference: string) {
    const url = `${this.paystackUrl}/transaction/verify/${reference}`;
    const headers = {
      Authorization: `Bearer ${this.configService.get<string>('PAYSTACK_SECRET_KEY')}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await this.httpService.get(url, { headers }).toPromise();
      return response?.data;
    } catch (error) {
      throw new Error(`Failed to retrieve Paystack transaction by reference: ${error.message}`);
    }
  }
  
  async getAllAbandonedTransactionReferences() {
    const url = `${this.paystackUrl}/transaction`;
    const headers = {
      Authorization: `Bearer ${this.configService.get<string>('PAYSTACK_SECRET_KEY')}`,
      'Content-Type': 'application/json',
    };
  
    try {
      const response = await this.httpService.get(url, { headers }).toPromise();
      console.log(response); 
      const transactionsArray = Array.isArray(response?.data) ? response.data : response?.data.data;
      const abandonedTransactions = transactionsArray.filter(transaction => transaction.status === 'abandoned');
      
      const referencesAndEmails = abandonedTransactions.map(transaction => ({
        reference: transaction.reference,
        email: transaction.customer.email
      }));
  
      return referencesAndEmails;
    } catch (error) {
      throw new Error(`Failed to get Paystack transactions: ${error.message}`);
    }
  }


  async createPaystackTransactionWithoutAuth(orderId: string, paystackDto: CreatePayStackTransactionCallbackUrlDTO) {
    const koboAmount = this.configService.get<number>('KOBO_AMOUNT') || 100;
  
    const url = `${this.paystackUrl}/transaction/initialize`;
    const callbackUrl = this.configService.get<string>('PAYSTACK_CALLBACK_URL');
    const headers = {
      Authorization: `Bearer ${this.configService.get<string>('PAYSTACK_SECRET_KEY')}`,
      'Content-Type': 'application/json',
    };
  
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
  
    let totalAmount: number | string;
    if (typeof order.totalAmount === "string") {
      totalAmount = parseFloat(order.totalAmount);
    } else {
      totalAmount = order.totalAmount * koboAmount;
    }
  
    const basicInfo = order.orderAdditionalInfo.find(info => info.basic_info !== undefined)?.basic_info;
    if (!basicInfo) {
      throw new Error("Basic info not found in orderAdditionalInfo");
    }
    const transactionData = {
      amount: totalAmount,
      email: basicInfo.email,
      callbackUrl: paystackDto.callbackUrl
    }
    try {
      const response = await lastValueFrom(
        this.httpService.post(url, { ...transactionData, callback: callbackUrl }, { headers })
      );
      const transactionDetails = {
        ...response?.data,
        callbackUrl: callbackUrl,
      };
      return transactionDetails;
    } catch (error) {
      throw new Error(`Failed to create Paystack transaction: ${error.message}`);
    }
  }

}
