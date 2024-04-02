import { IsNotEmpty, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDigifranchiseExpenseDto {
 @ApiProperty({ example: 10 })
 @IsNotEmpty()
 @IsNumber()
 quantity: number;

 @ApiProperty({ example: 100.00 })
 @IsNotEmpty()
 @IsNumber()
 unityCost: number;

 @ApiProperty({ example: true })
 @IsNotEmpty()
 @IsBoolean()
 purchaseDone: boolean;

 @ApiProperty({ example: '2024-03-15T00:00:00Z' })
 @IsNotEmpty()
 puchaseDate: Date;
}

export class UpdateDigifranchiseExpenseDto {
 @ApiProperty({ example: 10 })
 @IsOptional()
 @IsNumber()
 quantity?: number;

 @ApiProperty({ example: 100.00 })
 @IsOptional()
 @IsNumber()
 unityCost?: number;

 @ApiProperty({ example: true })
 @IsOptional()
 @IsBoolean()
 purchaseDone?: boolean;

 @ApiProperty({ example: '2024-03-15T00:00:00Z' })
 @IsOptional()
 puchaseDate: Date;
}