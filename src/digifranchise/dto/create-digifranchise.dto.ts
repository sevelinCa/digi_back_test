
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { StatusEnum } from 'src/statuses/statuses.enum';

export class CreateDigifranchiseDto {
  @ApiProperty({ example: 'Unique Digifranchise Name' })
  @IsNotEmpty()
  @IsString()
  digifranchiseName: string;

  @ApiProperty({ example: 'Description of Digifranchise', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: StatusEnum.inactive, enum: StatusEnum })
  @IsNotEmpty()
  @IsEnum(StatusEnum)
  status: StatusEnum;

  @ApiProperty({ example: '5000', required: false })
  @IsOptional()
  @IsString()
  digifranchiseFee?: string;


}
