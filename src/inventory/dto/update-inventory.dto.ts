import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsInt,
  IsString,
  Length,
  Min,
  IsNumber,
  IsDate,
  IsDateString,
} from 'class-validator';

export class UpdateInventoryDto {
  @ApiPropertyOptional({ example: 'Laptop' })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  itemName?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({ example: 1500.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  costPerItem?: number;

  @ApiPropertyOptional({
    example: '2024-12-15T00:00:00Z',
    description: 'Date of the income received',
  })
  @IsOptional()
  @IsDateString()
  dateReceived?: Date;
}
