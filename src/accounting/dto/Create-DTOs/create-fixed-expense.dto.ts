import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateFixedExpenseDto {
  @ApiProperty({ example: "Water bill" })
  @IsString()
  @IsNotEmpty()
  fixedExpense: string;
}
