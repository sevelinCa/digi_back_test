import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateDigifranchiseComplianceInfoDto {
  @ApiProperty({ example: '100391034' })
  @IsString()
  @IsOptional()
  companyRegisterationNumber: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  taxNumber: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  taxClearencePin: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  uifRegistration: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  workMansCompensation: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  sdlNumber: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  otherComplianceDocs: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  uploadedDocs: string
}