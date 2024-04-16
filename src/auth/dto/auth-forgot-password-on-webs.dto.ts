
import { ApiProperty } from '@nestjs/swagger';

export class AuthForgotPasswordForWebSiteDto {
    @ApiProperty({ example: 'user@example.com' })
    email: string;

    @ApiProperty({ example: 'https://www.example.com', required: true })
    websiteURL: string; 

    @ApiProperty({ example: '07888888888', required: true })
    connectNumber: string;
  }

