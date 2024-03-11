import { IsNotEmpty, IsString, IsEmail, IsOptional, Length, IsBoolean, IsDecimal } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryManagementDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'New inventory' })
    description: string;

    @IsNotEmpty()
    @ApiProperty({ example: 5000.00 })
    quantity: number;
}

export class UpdateInventoryManagementDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'New Inventory' })
    description?: string;

    @IsOptional()
    @ApiProperty({ example: 5000.00 })
    quantity?: number;
}