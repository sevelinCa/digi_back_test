import { IsString, IsObject, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

class PayoutSettingsDto {
  @ApiProperty({ example: "IMMEDIATE" })
  @IsString()
  interval: string;

  @ApiProperty({ example: "WALLET" })
  @IsString()
  refund: string;
}

export class CreateUserDto {
  @ApiProperty({ example: "First Name" })
  @IsString()
  givenName: string;

  @ApiProperty({ example: "Last Name" })
  @IsString()
  familyName: string;

  @ApiProperty({ example: "email@example.net" })
  @IsString()
  email: string;

  @ApiProperty({ example: "+27000000000" })
  @IsString()
  mobile: string;
}

export class CreateOrganizationDto {
  @ApiProperty({ example: "Org Name" })
  @IsString()
  name: string;

  @ApiProperty({ example: "Trading As name" })
  @IsString()
  tradeName: string;

  @ApiProperty({ example: "PRIVATE" })
  @IsString()
  type: string;

  @ApiProperty({ example: "0000/000000/00" })
  @IsString()
  registrationNumber: string;

  @ApiProperty({ example: "000000000" })
  @IsString()
  taxNumber: string;
}

export class CreateBankAccountDto {
  @ApiProperty({ example: "0000000000" })
  @IsString()
  accountNumber: string;

  @ApiProperty({ example: "CHEQUE" })
  @IsString()
  accountType: string;

  @ApiProperty({ example: "SBSA" })
  @IsString()
  bank: string;
}

export class CreateSettingsDto {
  @ApiProperty({ type: PayoutSettingsDto })
  @IsObject()
  @ValidateNested()
  @Type(() => PayoutSettingsDto)
  payout: PayoutSettingsDto;
}

export class CreateTokenDto {
  @ApiProperty({ type: CreateUserDto })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @ApiProperty({ type: CreateOrganizationDto })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateOrganizationDto)
  organization: CreateOrganizationDto;

  @ApiProperty({ type: CreateBankAccountDto })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateBankAccountDto)
  bankAccount: CreateBankAccountDto;

  @ApiProperty({ type: CreateSettingsDto })
  @IsObject()
  @ValidateNested()
  @Type(() => CreateSettingsDto)
  settings: CreateSettingsDto;
}
