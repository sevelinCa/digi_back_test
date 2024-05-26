import { ApiProperty } from "@nestjs/swagger";
import {
  IsAlpha,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { Documents } from "../entities/digifranchise-professional-body-membership.entity";

export class AddProfessionalMembershipDto {
  @ApiProperty({ example: "uuid" })
  @IsNotEmpty()
  @IsString()
  professionalBodyId: string;

  @ApiProperty({ example: "uuid" })
  @IsNotEmpty()
  @IsString()
  accreditationId: string;

  @ApiProperty({ example: "2024-10-10" })
  @IsNotEmpty()
  @IsString()
  renewalDate: string;

  @ApiProperty({
    example: [
      {
        documentName: "document Name",
        link: "https://linktodocument.pdf",
        renewalDate: "2024-10-10",
      },
    ],
  })
  @IsOptional()
  @IsArray()
  documents: Documents[];
}
