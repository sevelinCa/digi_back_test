import { IsOptional, IsInt, Min, IsDateString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateOperatingParametersDto {
  @ApiProperty({
    example: 600.0,
    description: "Total sales paid by credit card",
  })
  @IsOptional()
  salesPaidByCreditCard?: number;

  @ApiProperty({ example: 400.0, description: "Total sales made on credit" })
  @IsOptional()
  salesMadeOnCredit?: number;

  @ApiProperty({ example: 35, description: "Average creditor terms in days" })
  @IsOptional()
  @IsInt()
  @Min(0)
  averageCreditorTerms?: number;

  @ApiProperty({ example: 50, description: "Average debtor terms in days" })
  @IsOptional()
  @IsInt()
  @Min(0)
  averageDebtorTerms?: number;

  @ApiProperty({
    example: "2024-02-15T00:00:00.000Z",
    description: "Date when the parameters were operated",
  })
  @IsOptional()
  @IsDateString()
  operatedAt?: Date;
}
