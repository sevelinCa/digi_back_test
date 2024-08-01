import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { CreatePayStackTransactionDTO } from './dto/paystack.dto';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PaystackService {
  private readonly paystackUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.paystackUrl = this.configService.get<string>('PAYSTACK_API_URL') || '';
  }

  async createTransaction(dto: CreatePayStackTransactionDTO) {
    
    const koboAmount = this.configService.get<number>('KOBO_AMOUNT') || 1000;


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
      return response?.data;
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
  
}
