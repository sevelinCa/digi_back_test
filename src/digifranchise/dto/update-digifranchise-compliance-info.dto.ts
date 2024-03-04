import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { OtherComplianceDocs } from '../entities/digifranchise-compliance-information.entity';

export class UpdateDigifranchiseComplianceInfoDto {
  @ApiProperty({ example: '100391034' })
  @IsString()
  @IsOptional()
  companyRegisterationNumber: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  vatNumber: string

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
  taxClearenceExpiration: string

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
  coidaRegisteration: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  sdlNumber: string

  @ApiProperty({ example: [{
    docName: 'example doc name',
    link: 'https://linktodoc.pdf',
    expiryDate: '2024-10-10'
  }], description: 'other compliance docs' })
  @IsArray()
  @IsOptional()
  otherComplianceDocs: OtherComplianceDocs[]

  // @ApiProperty({ example: [{
  //   link: 'https://linktodoc.pdf'
  // }], description: 'upload docs' })
  // @IsArray()
  // @IsOptional()
  // uploadedDocs: UploadDocs[]
}