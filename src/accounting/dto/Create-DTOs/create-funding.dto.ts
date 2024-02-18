import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFundingDto {
  @ApiProperty({ example: 'Investor A' })
  @IsNotEmpty()
  @IsString()
  source: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  monthReceived: number;

  @ApiProperty({ example: 12 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  repaymentTerm: number;

  @ApiProperty({ example: 5.0 })
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  annualInterestRate: number;

  @ApiProperty({ example: '2024-03-15T00:00:00Z' })
  @IsNotEmpty()
  fundedAt: Date;
}
