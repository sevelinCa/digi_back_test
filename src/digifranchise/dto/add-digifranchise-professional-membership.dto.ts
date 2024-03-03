import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AddProfessionalMembershipDto {
  @ApiProperty({ example: 'uuid' })
  @IsNotEmpty()
  @IsString()
  professionalBodyId: string;

  @ApiProperty({ example: 'uuid' })
  @IsNotEmpty()
  @IsString()
  accreditationId: string;

  @ApiProperty({ example: '2024-10-10' })
  @IsNotEmpty()
  @IsString()
  renewalDate: string;
}