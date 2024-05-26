import { IsNotEmpty, IsInt, Min, IsDateString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateOperatingParametersDto {
  @ApiProperty({
    example: 500.0,
    description: "Total sales paid by credit card",
  })
  @IsNotEmpty()
  salesPaidByCreditCard: number;

  @ApiProperty({ example: 300.0, description: "Total sales made on credit" })
  @IsNotEmpty()
  salesMadeOnCredit: number;

  @ApiProperty({ example: 30, description: "Average creditor terms in days" })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  averageCreditorTerms: number;

  @ApiProperty({ example: 45, description: "Average debtor terms in days" })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  averageDebtorTerms: number;

  @ApiProperty({
    example: "2024-02-14T00:00:00.000Z",
    description: "Date when the parameters were operated",
  })
  @IsNotEmpty()
  @IsDateString()
  operatedAt: Date;
}
