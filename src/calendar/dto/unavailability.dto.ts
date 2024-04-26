import { IsNotEmpty, IsArray, ValidateNested, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class Unavailability {
  @IsString()
  @ApiProperty({ example: '2023-04-01' })
  date: string;
 
  @IsString()
  @ApiProperty({ example: '10:00:00' })
  startTime: string;
 
  @IsString()
  @ApiProperty({ example: '12:00:00' })
  endTime: string;
 }

export class CreateUnavailableManagementDto {

  @ApiProperty({
    type: () => Unavailability,
    isArray: true,
    description: 'An array of UnavailableTime objects',
    example: [
      { date: '2023-04-01', startTime: '10:00:00', endTime: '12:00:00' },
      { date: '2023-04-02', startTime: '14:00:00', endTime: '16:00:00' },
    ],
 })
 @IsNotEmpty()
 @IsArray()
 @ValidateNested({ each: true })
 @Type(() => Unavailability)
 unavailableTime: Unavailability[];
}

export class UpdateUnavailableManagementDto {
  @ApiProperty({
    type: () => Unavailability,
    isArray: true,
    description: 'An array of UnavailableTime objects',
    example: [
      { date: '2023-04-01', startTime: '10:00:00', endTime: '12:00:00' },
      { date: '2023-04-02', startTime: '14:00:00', endTime: '16:00:00' },
    ],
 })
 @IsOptional()
 @IsArray()
 @ValidateNested({ each: true })
 @Type(() => Unavailability)
 unavailableTime?: Unavailability[];
}