import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsObject,
  IsArray,
  IsBoolean,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class Qualifications {
  @ApiProperty({
    example: "Bcs, Software Engineer",
    description: "Qualification name",
  })
  @IsNotEmpty()
  @IsString()
  qualificationName: string;

  @ApiProperty({
    example: "University of Ibadan",
    description: "Instution name",
  })
  @IsNotEmpty()
  @IsString()
  institution: string;

  @ApiPropertyOptional({
    example: "2024-03-15T00:00:00Z",
    description: "Received date of the products",
  })
  @IsOptional()
  yearObtained: Date;

  @ApiProperty({
    example: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.fotor.com",
    description: "Qualification copy.",
  })
  @IsNotEmpty()
  @IsString()
  qualificationCopy: string;
}

export class ProfessionalBody {
  @ApiProperty({
    example: "Professional body",
  })
  @IsNotEmpty()
  @IsString()
  professionalBody: string;

  @ApiProperty({
    example: "Certificate name",
  })
  @IsNotEmpty()
  @IsString()
  certificateName: string;

  @ApiProperty({
    example: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.fotor.com",
  })
  @IsNotEmpty()
  @IsString()
  certificateCopy: string;

  @ApiPropertyOptional({
    example: "2024-03-15T00:00:00Z",
  })
  @IsOptional()
  dateObtained: Date;

  @ApiPropertyOptional({
    example: "2024-03-15T00:00:00Z",
  })
  @IsOptional()
  expiryDate: Date;
}

export class Crimes {
  @ApiProperty({
    example: "Burglary",
    description: "name of crim",
  })
  @IsNotEmpty()
  @IsString()
  crimeName: string;
}

export class UserProfileDto {
  @ApiProperty({
    example: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.fotor.com",
    description: "The image of the user.",
  })
  @IsOptional()
  @IsString()
  image: string;

  @ApiProperty({
    example: "https://idImage.com",
    description: "The id of the user.",
  })
  @IsOptional()
  @IsString()
  idImage: string;

  @ApiProperty({
    example: "example@gmail.com",
    description: "The email of the user.",
  })
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty({
    example: "John",
    description: "The first name of the user.",
  })
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty({
    example: "Deo",
    description: "The last name of the user.",
  })
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty({ example: "2024-03-15" })
  @IsOptional()
  dateOfBirth: Date;

  @ApiProperty({
    example: "MALE",
    description: "Gender of the user.",
  })
  @IsOptional()
  @IsString()
  gender: string;

  @ApiProperty({
    example: "White",
    description: "Race of the user.",
  })
  @IsOptional()
  @IsString()
  race: string;

  @ApiProperty({
    example: "adress",
    description: "Home address of the user.",
  })
  @IsOptional()
  @IsString()
  homeAddress: string;

  @ApiProperty({
    example: "+250009890000",
    description: "Mobile number of the user.",
  })
  @IsOptional()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: "Bcs",
    description: "Education level of the user.",
  })
  @IsOptional()
  @IsString()
  educationLevel: string;

  @ApiProperty({
    example: "Engineer",
    description: "current activity of the user.",
  })
  @IsOptional()
  @IsString()
  currentActivity: string;

  @ApiProperty({
    example: "Software engineer",
    description: "Field of the study.",
  })
  @IsOptional()
  @IsString()
  fieldOfStudy: string;

  @ApiProperty({
    type: () => Qualifications,
    isArray: true,
    description: "An array of qualifications objects",
  })
  @IsOptional()
  qualifications: Qualifications[];

  @ApiProperty({
    type: () => ProfessionalBody,
    isArray: true,
    description: "An array of professional body objects",
  })
  @IsOptional()
  professionalBody: ProfessionalBody[];

  @ApiProperty({
    example: "false",
    description: "If SA citizen, true, else false",
  })
  @IsOptional()
  @IsBoolean()
  southAfricanCitizen: boolean | null;

  @ApiProperty({
    example: "PC094824",
    description: "ID or Document number",
  })
  @IsOptional()
  @IsString()
  documentId: string | null;

  @ApiProperty({
    example: "Mozambique",
    description: "Country of Origin of user",
  })
  @IsOptional()
  @IsString()
  countryOfOrigin: string | null;

  @ApiProperty({
    example: false,
    description: "Does the user have a criminal record",
  })
  @IsOptional()
  @IsBoolean()
  criminalRecord: string | null;

  @ApiProperty({
    example: "https://example.com/file.pdf",
    description: "Link to Police Clearence Certficate",
  })
  @IsOptional()
  @IsString()
  policeClearenceCertificate: string | null;

  @ApiProperty({
    type: () => Crimes,
    isArray: true,
    description: "An array of crimes done by the uer",
  })
  @IsOptional()
  crimes: Crimes[] | null;
}
