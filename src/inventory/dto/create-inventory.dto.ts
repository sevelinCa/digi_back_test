import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryDto {
  @ApiProperty({
    example: 'Item 1',
    description: 'The name of the inventory item.',
  })
  @IsNotEmpty()
  @IsString()
  itemName: string;

  @ApiProperty({ description: 'The quantity of the inventory item.' })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'The cost per item of the inventory item.' })
  @IsNotEmpty()
  @IsNumber()
  costPerItem: number;

  @ApiProperty({
    description: 'The total value of the inventory item.',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  totalValue?: number;

  @ApiProperty({ example: '2024-03-15T00:00:00Z' })
  @IsNotEmpty()
  dateReceived: Date;
}
