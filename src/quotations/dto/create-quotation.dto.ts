import {
  IsString,
  IsDate,
  IsArray,
  IsOptional,
  IsNotEmpty,
  IsUUID,
  IsBoolean,
  IsNumber,
  IsUrl,
  ValidateNested,
  IsEmail,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { CreateQuotationRequestDto } from "./create-quotation-request.dto";

export class CreateQuotationDto {
  @ApiProperty({ example: "5f4e7b7b-4b7d-4b7d-8b7d-4b7d4b7d4b7d" })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({ example: "5f4e7b7b-4b7d-4b7d-8b7d-4b7d4b7d4b7d" })
  @IsUUID()
  quotationRequest: string;

  @ApiProperty({ example: 5.5 })
  @IsNumber()
  @IsOptional()
  taxAmount: number;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  isOrdered: boolean;

  @ApiProperty({ example: 1200.0 })
  @IsOptional()
  @IsNumber()
  totalPrice: number;

  @ApiProperty({ example: "2024-03-15T00:00:00Z" })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ example: "2024-03-15T00:00:00Z" })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @ApiProperty({ example: "2024-03-15T00:00:00Z" })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deletedAt: Date;
}

export type QuotationWithMessage = { message: string } & CreateQuotationDto;
