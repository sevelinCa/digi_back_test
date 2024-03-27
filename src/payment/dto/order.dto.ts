import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsInt, Min, IsNumber, IsPositive, IsEnum, IsOptional, IsString } from "class-validator";

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

export class CreateOrderBasicInfo {
    @ApiProperty({ example: 'John Doe' })
    @IsNotEmpty()
    @IsString()
    fullNames: string;

    @ApiProperty({ example: '+1234567890' })
    @IsNotEmpty()
    @IsString()
    contactDetails: string;

    @ApiProperty({ example: '123 Main St, Anytown, Anystate, 12345' })
    @IsNotEmpty()
    @IsString()
    address: string;
}

export class UpdateOrderBasicInfo {
    @ApiProperty({ example: 'Jane Doe', required: false })
    @IsOptional()
    @IsString()
    fullNames?: string;

    @ApiProperty({ example: '+0987654321', required: false })
    @IsOptional()
    @IsString()
    contactDetails?: string;

    @ApiProperty({ example: '456 Elm St, Anytown, Anystate, 67890', required: false })
    @IsOptional()
    @IsString()
    address?: string;
}