import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class BookedTimeslotDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Monday' })
  day: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: '2024-07-31 09:00:04.768174' })
  workingDate: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '09:00' })
  startTime: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '17:00' })
  endTime: string;
}
