import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEnum,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { Currency, FeeAllocation, Industry } from "../enums";

export class CreateAllocationDto {
  @ApiProperty({ example: "Allocation Title" })
  @IsString()
  title: string;

  @ApiProperty({ example: "This is an allocation description." })
  @IsString()
  description: string;

  @ApiProperty({ example: 10000.0 })
  @IsNumber()
  value: number;

  @ApiProperty({ example: 7 })
  @IsNumber()
  daysToDeliver: number;

  @ApiProperty({ example: 7 })
  @IsNumber()
  daysToInspect: number;
}

export class CreatePartyDto {
  @ApiProperty({ example: "15Ndyzw4lUfWnTTeV0ggOY" })
  @IsString()
  token: string;

  @ApiProperty({ example: "BUYER" })
  @IsString()
  role: string;
}

export class CreateTransactionDto {
  @ApiProperty({ example: "Transaction Title" })
  @IsString()
  title: string;

  @ApiProperty({ example: "This is a transaction description." })
  @IsString()
  description: string;

  @ApiProperty({ example: Industry.GENERAL_GOODS_SERVICES })
  @IsEnum(Industry)
  industry: Industry;

  @ApiProperty({ example: Currency.ZAR })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({ example: FeeAllocation.SELLER })
  @IsEnum(FeeAllocation)
  feeAllocation: FeeAllocation;

  @ApiProperty({ type: [CreateAllocationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAllocationDto)
  allocations: CreateAllocationDto[];

  @ApiProperty({ type: [CreatePartyDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePartyDto)
  parties: CreatePartyDto[];
}
