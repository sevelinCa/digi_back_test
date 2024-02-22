import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsInt,
  IsString,
  Length,
  Min,
  IsNumber,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsArray,
} from 'class-validator';
// import { Entries } from './create-inventory.dto';
import { InventoryEntries } from '../entities/inventory-entries.entity';

export class UpdateInventoryDto {
  @ApiProperty({
    example: 'Item 1',
    description: 'The name of the inventory item.',
  })
  @IsOptional()
  @IsString()
  itemName: string;

  // @ApiProperty({
  //   example: [{
  //     quantity: 'The Quantity recieved',
  //     costPerItem: 'cost per item',
  //     dateRecieved: 'date recieved'
  //   }],
  //   description: 'The name of the inventory item.',
  // })
  // @IsOptional()
  // @IsArray()
  // entries: InventoryEntries[];
}
