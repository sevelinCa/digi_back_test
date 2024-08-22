import {
  IsUUID,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDate,
  IsString,
  IsUrl,
  Min,
  IsEmail,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

export class CreateQuotationRequestDto {
  @ApiProperty({ example: "3df207f1-52f3-4a62-83a2-1ad9212d8603" })
  @IsNotEmpty()
  @IsUUID()
  ownedDigifranchiseId: string;

  @ApiProperty({
    example:
      "https://beta.crop-minder.digifranchise.co.za/0789374643/order?serviceId=7048574d-2d6b-4aec-82e8-0d4b8b562d0b",
  })
  @IsString()
  @IsUrl()
  digifranchiseUrl: string;

  @ApiProperty({ example: "5f4e7b7b-4b7d-4b7d-8b7d-4b7d4b7d4b7d" })
  @IsUUID()
  @IsOptional()
  product?: string;

  @ApiProperty({ example: "65b198d6-2aeb-4487-827b-f9a3f84334f0" })
  @IsUUID()
  @IsOptional()
  service?: string;

  @ApiProperty({ example: "6f5f8e8c-5d8e-5d8e-9d8e-5d8e5d8e5d8e" })
  @IsUUID()
  @IsOptional()
  subService?: string;

  @ApiProperty({ example: "6f5f8e8c-5d8e-5d8e-9d8e-5d8e5d8e5d8e" })
  @IsUUID()
  @IsOptional()
  serviceCategory?: string;

  @ApiProperty({ example: "6f5f8e8c-5d8e-5d8e-9d8e-5d8e5d8e5d8e" })
  @IsUUID()
  @IsOptional()
  subProduct?: string;

  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: "2024-03-15T00:00:00Z" })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  expiryDate?: Date;

  @ApiProperty({ example: "2024-03-15T00:00:00Z" })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  provisionHours?: Date;

  @ApiProperty({ example: 120.0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  price: number;

  @ApiProperty({ example: "John Doe" })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: "johndoe@gmail.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
