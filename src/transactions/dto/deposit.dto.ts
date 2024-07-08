import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDepositDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '2x1aON640HKL0mKz3nTsY' })
  transactionId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'First Name Last Name' })
  cardholderName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '4548 5813 4053 8370' })
  cardNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '12/24' })
  expiryDate: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '123' })
  cvv: string;
}
