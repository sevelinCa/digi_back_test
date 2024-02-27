import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDigifranchiseServiceOfferedDto {
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
