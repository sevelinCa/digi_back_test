import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateFixedExpenseDto {
  @ApiProperty({ example: "Electricity/Water" })
  @IsString()
  fixedExpenseId: string;
}
