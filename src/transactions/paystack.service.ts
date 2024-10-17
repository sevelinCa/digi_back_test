import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { CreatePayStackSubAccountDTO, CreatePayStackTransactionCallbackUrlDTO, CreatePayStackTransactionDTO, InitializeSplitPaymentDTO,  } from './dto/paystack.dto';
import { firstValueFrom, lastValueFrom } from 'rxjs';
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
    const koboAmount = this.configService.get<number>('KOBO_AMOUNT')!;
  
    const url = `${this.paystackUrl}/transaction/initialize`;
    const callbackUrl = this.configService.get<string>('PAYSTACK_CALLBACK_URL');
    const headers = {
      Authorization: `Bearer ${this.configService.get<string>('PAYSTACK_SECRET_KEY')}`,
      'Content-Type': 'application/json',
    };
  
    const amountInKobo = dto.amount * koboAmount;
  
    const transactionData = {
      ...dto,
      amount: amountInKobo, 
      callback_url: callbackUrl, 
    };
  
    try {
      const response = await lastValueFrom(
        this.httpService.post(url, transactionData, { headers })
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
    const koboAmount = this.configService.get<number>('KOBO_AMOUNT')!;
  
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
  
    let totalAmount: number;
    if (typeof order.totalAmount === "string") {
      totalAmount = parseFloat(order.totalAmount) * koboAmount;
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
      callback_url: paystackDto.callback_url
    };
  
    try {
      const response = await lastValueFrom(
        this.httpService.post(url, transactionData, { headers })
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
  
  async createPaystackTransactionWithAuth(userId: string, orderId: string, paystackDto: CreatePayStackTransactionCallbackUrlDTO) {
    const koboAmount = this.configService.get<number>('KOBO_AMOUNT')!;
  
    const url = `${this.paystackUrl}/transaction/initialize`;
    const callbackUrl = this.configService.get<string>('PAYSTACK_CALLBACK_URL');
    const headers = {
      Authorization: `Bearer ${this.configService.get<string>('PAYSTACK_SECRET_KEY')}`,
      'Content-Type': 'application/json',
    };
  
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
  
    let totalAmount: number;
    if (typeof order.totalAmount === "string") {
      totalAmount = parseFloat(order.totalAmount) * koboAmount;
    } else {
      totalAmount = order.totalAmount * koboAmount;
    }
  
    const transactionData = {
      amount: totalAmount,
      email: user.email,
      callback_url: paystackDto.callback_url
    };
  
    try {
      const response = await lastValueFrom(
        this.httpService.post(url, transactionData, { headers })
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

  async getPayStackSupportedBanks(): Promise<any> {
    const apiUrl = 'https://api.paystack.co/bank'; 
    const apiKey = process.env.PAYSTACK_API_KEY;
  
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };
  
    try {
      const response = await firstValueFrom(
        this.httpService.get(apiUrl, { headers })
      );
      
      return response.data; 
    } catch (error) {
      throw new Error(`Failed to get Paystack supported banks: ${error.message}`);
    }
  }


  async getPayStackSupportedCountry(): Promise<any> {
    const apiUrl = 'https://api.paystack.co/country'; 
    const apiKey = process.env.PAYSTACK_API_KEY;
  
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };
  
    try {
      const response = await firstValueFrom(
        this.httpService.get(apiUrl, { headers })
      );
      
      return response.data; 
    } catch (error) {
      throw new Error(`Failed to get Paystack supported countrys: ${error.message}`);
    }
  }



  
  async createSubAccount(dto: CreatePayStackSubAccountDTO) {
    const url = `${this.paystackUrl}/subaccount`;
    const headers = {
      Authorization: `Bearer ${this.configService.get<string>('PAYSTACK_SECRET_KEY')}`,
      'Content-Type': 'application/json',
    };
   
    try {
      const response = await lastValueFrom(
        this.httpService.post(url, dto, { headers })
      );
      const subaccountData = response?.data?.data;
      
      return {
        status: true,
        message: 'Subaccount created successfully',
        data: subaccountData,
      };
    } catch (error) {
      console.error('Error creating subaccount:', error?.response?.data);
      
      if (error.response && error.response.status === 400) {
        throw new HttpException(
          error.response?.data?.message || 'Invalid input data for subaccount',
          HttpStatus.BAD_REQUEST,
        );
      }
      
      throw new HttpException(
        error.response?.data?.message || 'Failed to create Paystack subaccount',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }



}
