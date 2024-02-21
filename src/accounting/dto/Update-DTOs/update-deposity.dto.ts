import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDepositDto {
  @ApiProperty({ example: 'Quarterly Payment' })
  @IsOptional()
  @IsString()
  item?: string;

  @ApiProperty({ example:  2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  monthPaid?: number;

  @ApiProperty({ example:  13 })
  @IsOptional()
  @IsInt()
  @Min(1)
  monthRecovered?: number;

  @ApiProperty({ example:  2000.0 })
  @IsOptional()
  @Min(0)
  @Max(10000000)
  depositAmount?: number;

  @ApiProperty({ example: '2024-03-16T00:00:00Z' })
  @IsOptional()
  depositedAt?: Date;
}