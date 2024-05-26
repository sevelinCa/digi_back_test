import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSupplierManagementDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "MBANDA John" })
  fullNames: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: "john.doe@example.com" })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(10, 15)
  @ApiProperty({ example: "1234567890" })
  mobile_number: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "Individual" })
  supplier_type: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: "CRN123456" })
  company_registration_number?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: "VAT123456" })
  vat_number?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: "123 Main St, Anytown, Anywhere" })
  address: string;
}

export class UpdateSupplierManagementDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: "MUGABO James",
    description: "The name of the supplier",
  })
  fullNames?: string;

  @IsOptional()
  @IsEmail()
  @ApiProperty({
    example: "john.doe@example.com",
    description: "The email of the supplier",
  })
  email?: string;

  @IsOptional()
  @IsString()
  @Length(10, 15)
  @ApiProperty({
    example: "1234567890",
    description: "The mobile number of the supplier",
  })
  mobile_number?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: "Individual", description: "The type of supplier" })
  supplier_type?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: "CRN123456",
    description: "The company registration number (if applicable)",
  })
  company_registration_number?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: "VAT123456",
    description: "The VAT number (if applicable)",
  })
  vat_number?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: "123 Main St, Anytown, Anywhere",
    description: "The address of the supplier",
  })
  address?: string;
}
