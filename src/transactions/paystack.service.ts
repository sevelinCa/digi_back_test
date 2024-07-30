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

  async verifyTransaction(reference: string) {
    console.log("Verifying transaction with reference:", reference);

    try {
      const response = await lastValueFrom(
        this.httpService
          .get(`${this.paystackApiUrl}/transaction/verify/${reference}`, {
            headers: {
              Authorization: `Bearer ${this.paystackApiKey}`,
            },
          })
          .pipe(
            map((response) => response.data),
            catchError((error) => {
              console.error(
                "Error during transaction verification:",
                error.response?.data,
              );
              throw new HttpException(
                error.response?.data?.message ||
                  "Transaction verification failed",
                error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
              );
            }),
          ),
      );

      console.log("Transaction verification response:", response);
      return response;
    } catch (error) {
      console.error("Transaction verification error:", error.message);
      throw new HttpException(
        error.message || "Transaction verification error",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
