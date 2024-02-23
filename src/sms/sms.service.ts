import { Injectable } from '@nestjs/common';
import  { Twilio } from 'twilio';

interface StoredOtp {
  otp: string;
  expiry: number;
}

@Injectable()
export class SmsService {
  private readonly client: Twilio
  private readonly otpStore: Map<string, StoredOtp>
  private readonly otpValidityDuration: number

  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    this.client = new Twilio(accountSid, authToken);
    this.otpStore = new Map<string, StoredOtp>();
    this.otpValidityDuration = 5 * 60 * 1000;
  }

  async sendOTP(phoneNumber: string) {
    const generateOtp = (): string => Math.floor(100000 + Math.random() * 900000).toString();
    try {
      const otp = generateOtp();

      const expiry = Date.now() + this.otpValidityDuration;
      this.otpStore.set(phoneNumber, { otp, expiry });

      const result = await this.client.messages.create({
        body: `Your OTP is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });

      console.log(`Message sent. SID: ${result.sid}`);
      return result;
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  }

  async verifyOTP(phoneNumber: string, otp: string): Promise<boolean> {
    const storedData = this.otpStore.get(phoneNumber);
    if (storedData && storedData.otp === otp && storedData.expiry > Date.now()) {
      this.otpStore.delete(phoneNumber); 
      return true;
    }
    return false;
  }
}
