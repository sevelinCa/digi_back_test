import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

interface StoredOtp {
  otp: string;
  expiry: number;
}

@Injectable()
export class SmsService {
  private readonly client: Twilio;
  private readonly otpStore: Map<string, StoredOtp>;
  private readonly otpValidityDuration: number;

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.client = new Twilio(accountSid, authToken);
    this.otpStore = new Map<string, StoredOtp>();
    this.otpValidityDuration = 5 * 60 * 1000;
  }

  async sendOTP(phoneNumber: string) {
    const generateOtp = (): string =>
      Math.floor(100000 + Math.random() * 900000).toString();
    try {
      const otp = generateOtp();

      const expiry = Date.now() + this.otpValidityDuration;
      this.otpStore.set(phoneNumber, { otp, expiry });

      const result = await this.client.messages.create({
        body: `Your OTP is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });

      return result;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errors: error.message,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async verifyOTP(phoneNumber: string, otp: string): Promise<boolean> {
    const storedData = this.otpStore.get(phoneNumber);

    if (
      storedData &&
      storedData.otp === otp &&
      storedData.expiry > Date.now()
    ) {
      this.otpStore.delete(phoneNumber);
      return true;
    }
    return false;
  }

  async sendOrderCreationConfirmMessage(phoneNumber: string, message: string): Promise<void> {
    try {
      await this.client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          errors: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
