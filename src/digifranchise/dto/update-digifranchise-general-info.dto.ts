import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateDigifranchiseGeneralInfoDto {
  @ApiProperty({ example: "James' digifranchise" })
  @IsString()
  @IsOptional()
  digifranchiseName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  facebookHandle: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  tiktokHandle: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  instagramHandle: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  xHandle: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  connectNumber: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  otherMobileNumber: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  aboutCompany: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  location: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  digifranchisePublishedWithCC: boolean;
}
