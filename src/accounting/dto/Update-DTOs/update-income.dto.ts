import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Length, IsInt, IsNumber } from "class-validator";

export class UpdateIncomeDto {
  @ApiPropertyOptional({ example: "Sales", description: "Source of income" })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  source?: string;

  @ApiPropertyOptional({ example: 10, description: "Quantity sold" })
  @IsOptional()
  @IsInt()
  quantity?: number;

  @ApiPropertyOptional({ example: 10.0, description: "Cost per unit" })
  @IsOptional()
  @IsNumber()
  unityCost?: number;

  @ApiPropertyOptional({
    example: "Monthly sales revenue",
    description: "Description of the income",
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  description?: string;

  @ApiPropertyOptional({
    example: "2024-03-15T00:00:00Z",
    description: "Date of the income received",
  })
  @IsOptional()
  incomeDate?: Date;
}
