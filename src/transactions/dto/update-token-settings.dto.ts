import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTokenSettingsDto {
  @ApiProperty({
    example: 'WEEKLY',
    description: 'Payout interval options: WALLET, IMMEDIATE, DAILY, WEEKLY, BIMONTHLY, MONTHLY'
  })
  @IsString()
  @IsIn(['WALLET', 'IMMEDIATE', 'DAILY', 'WEEKLY', 'BIMONTHLY', 'MONTHLY'])
  payoutInterval: string;

  @ApiProperty({
    example: 'WALLET',
    description: 'Refund method options: WALLET, IMMEDIATE'
  })
  @IsString()
  @IsIn(['WALLET', 'IMMEDIATE'])
  refundMethod: string;
}