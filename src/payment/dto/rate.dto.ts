import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsUUID } from "class-validator";

export class CreateRateDto {
    @ApiProperty({ example: 'VAT' })
    @IsString()
    @IsNotEmpty()
    rateName: string;

    @ApiProperty({ example: 5, required: false })
    @IsOptional()
    @IsNumber()
    rateNumber?: number | null;
}

export class UpdateRateDto {
    @ApiProperty({ example: 'Standard VAT Rate', required: false })
    @IsOptional()
    @IsString()
    rateName?: string;

    @ApiProperty({ example: 5, required: false })
    @IsOptional()
    @IsNumber()
    rateNumber?: number | null;
}