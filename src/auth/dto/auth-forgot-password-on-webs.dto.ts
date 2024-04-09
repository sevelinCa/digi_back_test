
import { ApiProperty } from '@nestjs/swagger';

export class AuthForgotPasswordForWebSiteDto {
 @ApiProperty({ example: 'user@exple.com' })
 email: string;

 @ApiProperty({ example: 'https://www.example.com' })
 websiteURL: string;

 @ApiProperty({ example: '0788888888' })
 connectNumber: string;

}

