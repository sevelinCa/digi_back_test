import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AddProfessionalMembershipDto {
  @ApiProperty({ example: 'Phone Training Sessions 1-on-1' })
  @IsNotEmpty()
  @IsString()
  professionalBodyId: string;

  @ApiProperty({ example: 'Phone Training Sessions' })
  @IsNotEmpty()
  @IsString()
  accreditationId: string;

  @ApiProperty({ example: '200' })
  @IsNotEmpty()
  @IsString()
  renewalDate: string;
}