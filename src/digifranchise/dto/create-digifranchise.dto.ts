import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

export class ServiceOffered {
  @ApiProperty({ example: 'My Awesome Franchise Service', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  serviceName: string;

  @ApiProperty({ example: 'My Awesome Franchise Service Description', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  serviceDescription: string

  @ApiProperty({ example: 'My Awesome Franchise', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  rate: string;
}

export class CreateDigifranchiseDto {
  @ApiProperty({ example: 'My Awesome Franchise', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  franchiseName?: string;

  @ApiProperty({ example: 'My Awesome Franchise Description', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ example: [{ ServiceName: 'example service', ServiceDescription: 'service description', Rate: 'Rate' }] ,required: false })
  @IsArray()
  @IsOptional()
  servicesOffered?: ServiceOffered[];
}
