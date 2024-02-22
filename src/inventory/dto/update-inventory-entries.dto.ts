import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsArray,
  IsString,
  Length,
  IsNumber,
  Min,
} from 'class-validator';
import { InventoryEntries } from '../entities/inventory-entries.entity';

export class UpdateInventoryEntriesDto {
    @ApiPropertyOptional({
        example: 15,
        description: 'Quantity of the product',
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    quantity?: number;
  
    @ApiPropertyOptional({
      example: 1500,
      description: 'Purchase price of the product',
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    costPerItem?: number;
  
    @ApiPropertyOptional({
      example: '2024-03-15T00:00:00Z',
      description: 'Received date of the products',
    })
    @IsOptional()
    dateReceived?: Date;
}
