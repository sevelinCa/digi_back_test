import { IsNotEmpty, IsString, IsEmail, IsOptional, Length, IsBoolean, IsDecimal } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStaffManagementDto {
    @IsOptional()
    @ApiProperty({ example: 'Image' })
    image?: string;
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'John Doe' })
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
    @ApiProperty({ example: '123456789' })
    id_or_passport_number: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '1990-01-01' })
    date_of_birth: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Manager' })
    role_description: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '123 Main St, Anytown, Anywhere' })
    address: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '2023-01-01' })
    date_started: string;

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty({ example: true })
    app_access: boolean;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Online' })
    registration_method: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '123456789' })
    tax_number: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '123456789' })
    uif_number: string;

    @IsNotEmpty()
    @ApiProperty({ example: 5000.00 })
    gross_monthly_salary: number;
}

export class UpdateStaffManagementDto {

    @IsOptional()
    @ApiProperty({ example: 'Image' })
    image?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'John Doe' })
    fullNames?: string;

    @IsOptional()
    @IsEmail()
    @ApiProperty({ example: 'john.doe@example.com' })
    email?: string;

    @IsOptional()
    @IsString()
    @Length(10, 15)
    @ApiProperty({ example: '1234567890' })
    mobile_number?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: '123456789' })
    id_or_passport_number?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: '1990-01-01' })
    date_of_birth?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'Manager' })
    role_description?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: '123 Main St, Anytown, Anywhere' })
    address?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: '2023-01-01' })
    date_started?: string;

    @IsOptional()
    @IsBoolean()
    @ApiProperty({ example: true })
    app_access?: boolean;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'Online' })
    registration_method?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: '123456789' })
    tax_number?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: '123456789' })
    uif_number?: string;

    @IsOptional()
    @ApiProperty({ example: 5000.00 })
    gross_monthly_salary?: number;
}