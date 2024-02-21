import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFundingDto {
  @ApiProperty({ example: 'Investor B' })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiProperty({ example:  2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  monthReceived?: number;

  @ApiProperty({ example:  13 })
  @IsOptional()
  @IsInt()
  @Min(1)
  repaymentTerm?: number;

  @ApiProperty({ example:  6.0 })
  @IsOptional()
  @Min(0)
  @Max(100)
  annualInterestRate?: number;

  @ApiProperty({ example: '2024-03-16T00:00:00Z' })
  @IsOptional()
  fundedAt?: Date;
}