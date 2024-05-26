import { IsOptional, IsEnum, ValidateNested, IsArray } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Arrangement } from "../../entities/expense.entity";

class UpdateMonthAmountDto {
  @ApiProperty({ example: "January", required: false })
  @IsOptional()
  month?: string;

  @ApiProperty({ example: 100.0, required: false })
  @IsOptional()
  amount?: number;
}

export class UpdateExpenseDto {
  @ApiProperty({ example: "cash", required: false })
  @IsEnum(Arrangement)
  @IsOptional()
  arrangement?: Arrangement;

  @ApiProperty({
    type: UpdateMonthAmountDto,
    isArray: true,
    description: "An array of MonthAmount objects",
    example: [
      { month: "March", amount: 150.0 },
      { month: "April", amount: 250.0 },
    ],
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateMonthAmountDto)
  @IsArray()
  monthlyExpense?: UpdateMonthAmountDto[];
}
