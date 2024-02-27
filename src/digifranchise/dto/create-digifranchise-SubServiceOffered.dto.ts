import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDigifranchiseSubServiceOfferedDto {
    @ApiProperty({ example: 'Phone Training Sessions 1-on-1' })
    @IsNotEmpty()
    @IsString()
    serviceName: string;

    @ApiProperty({ example: 'Phone Training Sessions' })
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty({ example: '200' })
    @IsNotEmpty()
    @IsString()
    unitPrice: string;
}

export class UpdateDigifranchiseSubServiceDto {
    @ApiProperty({ example: 'Phone Training Sessions 1-on-1' })
    @IsOptional()
    @IsString()
    serviceName: string;

    @ApiProperty({ example: 'Phone Training Sessions' })
    @IsOptional()
    @IsString()
    description: string;

    @ApiProperty({ example: '200' })
    @IsOptional()
    @IsString()
    unitPrice: string;
}