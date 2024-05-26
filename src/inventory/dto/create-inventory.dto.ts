import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsObject,
  IsArray,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { InventoryEntries } from "../entities/inventory-entries.entity";

// export class Entries {
//   @ApiProperty({ description: 'The quantity of the inventory item.' })
//   @IsNotEmpty()
//   @IsNumber()
//   quantity: number;

//   @ApiProperty({ description: 'The cost per item of the inventory item.' })
//   @IsNotEmpty()
//   @IsNumber()
//   costPerItem: number;

//   @ApiProperty({ example: '2024-03-15T00:00:00Z' })
//   @IsNotEmpty()
//   dateReceived: Date;

//   @ApiProperty({
//     description: 'The total value of the inventory item.',
//     required: false,
//   })

//   @IsOptional()
//   @IsNumber()
//   totalValue?: number;
// }

export class CreateInventoryDto {
  @ApiProperty({
    example: "Item 1",
    description: "The name of the inventory item.",
  })
  @IsNotEmpty()
  @IsString()
  itemName: string;

  @ApiProperty({
    example: [
      {
        quantity: "The Quantity recieved",
        costPerItem: "cost per item",
        dateRecieved: "date recieved",
      },
    ],
    description: "The name of the inventory item.",
  })
  @IsNotEmpty()
  @IsArray()
  entries: InventoryEntries[];
}
