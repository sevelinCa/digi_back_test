import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, Length, IsUrl, IsOptional } from "class-validator";

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
    description: "Name of the business for the subAccount",
  })
  @IsNotEmpty()
  business_name: string;

  @ApiProperty({
    example: "068",
    description: "Three-digit bank code",
  })
  @IsNotEmpty()
  @Length(3, 3)
  bank_code: string;

  @ApiProperty({
    example: "1234567890",
    description: "Ten-digit account number",
  })
  @IsNotEmpty()
  @Length(10, 10)
  account_number: string;

  @ApiProperty({
    example: 15,
    description: "Percentage charge for the subAccount (0-100)",
  })
  @IsNotEmpty()
  percentage_charge: number;
}


export class InitializeSplitPaymentDTO {
  @ApiProperty({
    example: "customer@email.com",
    description: "Customer's email",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 20000,
    description: "Amount to charge in kobo (20000 = 200 Naira)",
  })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    example: "ACCT_xxxxxxxxxx",
    description: "Subaccount to split the payment with",
  })
  @IsNotEmpty()
  subaccount: string;

  @ApiProperty({
    example: 10000,
    description: "Flat fee that goes to the main account",
    required: false,
  })
  transaction_charge?: number;

  @ApiProperty({
    example: "subaccount",
    description: "Bearer of transaction fee (optional)",
    required: false,
  })
  bearer?: string;
}
