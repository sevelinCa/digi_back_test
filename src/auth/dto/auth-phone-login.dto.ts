import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsPhoneNumber, MinLength } from "class-validator";
import { Transform } from "class-transformer";
import { lowerCaseTransformer } from "../../utils/transformers/lower-case.transformer";

export class AuthPhoneLoginDto {
  @ApiProperty({ example: "+27018009303" })
  @Transform(lowerCaseTransformer)
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty()
  @MinLength(6)
  password: string;
}
