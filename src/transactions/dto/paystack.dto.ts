import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, Length } from "class-validator";

export class CreatePayStackTransactionDTO {
  @ApiProperty({ example: 1000, description: "Amount to be charged" })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: "example@example.com",
    description: "Customer email",
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "https://example.com/callback",
    description: "Callback URL after transaction completion",
  })
  @IsNotEmpty()
  @Length(0, 255)
  callbackUrl: string;
}
