import { HttpService } from "@nestjs/axios";
import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from "@nestjs/common";
import { CreatePayStackTransactionDTO } from "./dto/paystack.dto";
import { lastValueFrom } from "rxjs";
import { catchError, map } from "rxjs/operators";
import axios from "axios";

@Injectable()
export class PaystackService {
  private readonly paystackApiUrl: string;
  private readonly paystackApiKey: string;

  constructor(private httpService: HttpService) {
    this.paystackApiUrl = process.env.PAYSTACK_API_URL!;
    if (!this.paystackApiUrl) {
      throw new NotFoundException("API URL NOT FOUND");
    }

    this.paystackApiKey = process.env.PAYSTACK_SECRET_KEY!;
    if (!this.paystackApiKey) {
      throw new NotFoundException("API SECRET KEY NOT FOUND");
    }
  }

  async initializeTransaction(dto: CreatePayStackTransactionDTO): Promise<any> {
    const data = {
      amount: dto.amount * 100,
      email: dto.email,
      callback_url: dto.callbackUrl,
    };

    try {
      const response = await axios.post(
        `${this.paystackApiUrl}/transaction/initialize`,
        data,
        {
          headers: {
            Authorization: `Bearer ${this.paystackApiKey}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`Paystack API Error: ${error.response.data.message}`);
      } else if (error.request) {
        throw new Error("No response from Paystack API");
      } else {
        throw new Error(
          `Error in transaction initialization: ${error.message}`,
        );
      }
    }
  }


}
