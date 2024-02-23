import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { RoleDto } from 'src/roles/dto/role.dto';
import { StatusDto } from 'src/statuses/dto/status.dto';
import { ProfessionalBody, Qualifications } from '../infrastructure/persistence/relational/entities/user.entity';
// import { FileDto } from 'src/files/dto/file.dto';

export class CreateUserDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  // @IsNotEmpty()
  @IsEmail()
  email: string | null;

  @ApiProperty({ example: '+27450049245' })
  @Transform(lowerCaseTransformer)
  // @IsNotEmpty()
  @IsEmail()
  phoneNumber: string | null;

  @ApiProperty()
  @MinLength(6)
  password?: string;

  provider?: string;

  socialId?: string | null;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  firstName: string | null;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  lastName: string | null;

  // @ApiProperty({ type: () => FileDto })
  // @IsOptional()
  // photo?: FileDto | null;

  @ApiProperty({ type: RoleDto })
  @IsOptional()
  @Type(() => RoleDto)
  role?: RoleDto | null;

  @ApiProperty({ type: StatusDto })
  @IsOptional()
  @Type(() => StatusDto)
  status?: StatusDto;

  hash?: string | null;

  image: string | null;

  idImage: string | null;

  gender: string | null;

  race: string | null;

  homeAddress: string | null;

  educationLevel: string | null;

  currentActivity: string | null;

  fieldOfStudy: string | null;

  qualifications: Qualifications[] | null;

  professionalBody: ProfessionalBody[] | null;

  isProfileComplete: boolean;
}
