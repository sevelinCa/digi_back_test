import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';

export class FaceBookCreateUserDto {
  @ApiProperty({ example: 'https://platform-lookaside.fbsbx.com/platform/prosh=-4_1ZMXPB2jY02Jdw5g' })
  @IsOptional()
  profilePic: string | null;

  @ApiProperty({ example: 'test123@example.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: string | null;

  @ApiProperty({ example: 'Jana' })
  @IsNotEmpty()
  firstName: string | null;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  lastName: string | null;
}
