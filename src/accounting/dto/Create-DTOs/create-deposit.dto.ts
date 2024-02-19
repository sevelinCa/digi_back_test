import { IsNotEmpty, IsString, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDepositDto {
  @ApiProperty({ example: 'Monthly Payment' })
  @IsNotEmpty()
  @IsString()
  item: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  monthPaid: number;

  @ApiProperty({ example: 12 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  monthRecovered: number;

  @ApiProperty({ example: 1000.0 })
  @IsNotEmpty()
  @Min(0)
  @Max(1000000)
  depositAmount: number;

  @ApiProperty({ example: '2024-03-15T00:00:00Z' })
  @IsNotEmpty()
  depositedAt: Date;
}
