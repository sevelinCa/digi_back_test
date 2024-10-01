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


export class CreatePayStackSubAccountDTO {
  @ApiProperty({
    example: "Business Name",
    description: "Name of the business for the subaccount",
  })
  @IsNotEmpty()
  business_name: string;

  @ApiProperty({
    example: "058",
    description: "Three-digit bank code",
  })
  @IsNotEmpty()
  @Length(3, 3)
  bank_code: string;

  @ApiProperty({
    example: "0123456789",
    description: "Ten-digit account number",
  })
  @IsNotEmpty()
  @Length(10, 10)
  account_number: string;

  @ApiProperty({
    example: 30,
    description: "Percentage charge for the subaccount (0-100)",
  })
  @IsNotEmpty()
  percentage_charge: number;
}


