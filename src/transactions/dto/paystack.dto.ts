import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, Length, IsUrl } from "class-validator";

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
    description: "URL to redirect to after payment",
  })
  @IsNotEmpty()
  @IsUrl()
  callback_url: string;
}



export class CreatePayStackTransactionCallbackUrlDTO {
  @ApiProperty({
    example: "https://example.com/callback",
    description: "URL to redirect to after payment",
  })
  @IsNotEmpty()
  @IsUrl()
  callback_url: string;
}