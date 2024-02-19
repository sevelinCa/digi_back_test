import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length, IsInt } from 'class-validator';
export class CreateIncomeDto {
  @ApiProperty({ example: 'Sales' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  source: string;

  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @ApiProperty({ example: 10.0 })
  @IsNotEmpty()
  unityCost: number;

  @ApiProperty({
    example: 'Monthly sales revenue',
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  description: string;

  @ApiProperty({ example: '2024-03-15T00:00:00Z' })
  @IsNotEmpty()
  incomeDate: Date;
}
