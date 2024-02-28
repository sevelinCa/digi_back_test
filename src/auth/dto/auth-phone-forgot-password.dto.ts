import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class PhoneForgotPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  phoneNumber: string;
}