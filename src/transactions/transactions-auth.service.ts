import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

@Injectable()
export class TransactionsAuthService {
    private token: string;
    private tokenExpiration: number;

    constructor(private httpService: HttpService) {}

    async getAccessToken(): Promise<string> {
        const currentTime = Math.floor(Date.now() / 1000);
        if (this.token && this.tokenExpiration > currentTime) {
            console.log('Using cached token:', this.token);
            return this.token;
        }

        const response: AxiosResponse<any> = await lastValueFrom(
            this.httpService.post(
                'https://auth.tradesafe.co.za/oauth/token',
                `grant_type=client_credentials&client_id=${process.env.TRADE_SAFE_CLIENT_ID}&client_secret=${process.env.TRADE_SAFE_CLIENT_SECRET}`,
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            )
        );

        console.log('Token Response:', response.data);

        this.token = response.data.access_token;
        this.tokenExpiration = currentTime + response.data.expires_in;
        return this.token;
    }
}
