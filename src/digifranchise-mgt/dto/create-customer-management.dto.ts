import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerManagementDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'MBANDA Customer' })
    fullNames: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: 'john.doe@example.com' })
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(10, 15)
    @ApiProperty({ example: '1234567890' })
    mobile_number: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Individual' })
    customer_type: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'CRN123456' })
    company_registration_number?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'VAT123456' })
    vat_number?: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '123 Main St, Anytown, Anywhere' })
    address: string;
}

export class UpdateCustomerManagementDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'MBANDA Customer' })
    fullNames: string;
    @IsOptional()
    @IsEmail()
    @ApiProperty({ example: 'john.doe@example.com', description: 'The email of the customer' })
    email?: string;

    @IsOptional()
    @IsString()
    @Length(10, 15)
    @ApiProperty({ example: '1234567890', description: 'The mobile number of the customer' })
    mobile_number?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'Individual', description: 'The type of customer' })
    customer_type?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'CRN123456', description: 'The company registration number (if applicable)' })
    company_registration_number?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'VAT123456', description: 'The VAT number (if applicable)' })
    vat_number?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: '123 Main St, Anytown, Anywhere', description: 'The address of the customer' })
    address?: string;
}