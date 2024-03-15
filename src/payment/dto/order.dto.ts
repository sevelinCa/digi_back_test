import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsInt, Min, IsNumber, IsPositive, IsEnum, IsOptional } from "class-validator";

export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
   }
export class CreateOrderTableDto {
 @ApiProperty({ example: 1 })
 @IsInt()
 @Min(1)
 quantity: number;

 @ApiProperty({ example: OrderStatus.PENDING, enum: OrderStatus })
 @IsEnum(OrderStatus)
 status: OrderStatus;

 @ApiProperty({ example: '2024-03-15T00:00:00Z' })
 @IsNotEmpty()
 OrderDate: Date;

}

export class UpdateOrderTableDto {
 @ApiProperty({ example: 1, required: false })
 @IsOptional()
 @IsInt()
 @Min(1)
 quantity?: number;

 @ApiProperty({ example: OrderStatus.PENDING, enum: OrderStatus, required: false })
 @IsOptional()
 @IsEnum(OrderStatus)
 status?: OrderStatus;
}