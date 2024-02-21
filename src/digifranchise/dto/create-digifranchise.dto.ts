import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDigifranchiseDto {
  @ApiProperty({ example: 'My Awesome Franchise', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  franchiseName?: string;
}
