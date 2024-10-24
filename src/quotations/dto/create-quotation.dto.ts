import {
  IsDate,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsNumber,
  Min,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { QuotationEntity } from "../entities/quotation.entity";

export class CreateQuotationDto {
  @ApiProperty({ example: "5f4e7b7b-4b7d-4b7d-8b7d-4b7d4b7d4b7d" })
  @IsUUID()
  quotationRequest: string;

  @ApiProperty({ example: 5.5 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  taxAmount: number;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  isOrdered: boolean;

  @ApiProperty({ example: 1200.0 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  totalPrice: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  provisionHours?: number;
}

export type QuotationWithMessage = { message: string; data: QuotationEntity };
