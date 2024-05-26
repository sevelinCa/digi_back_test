import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsString } from "class-validator";

export class AuthForgotPasswordForWebSiteDto {
  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "https://www.example.com" })
  @IsString()
  websiteURL: string;
}
