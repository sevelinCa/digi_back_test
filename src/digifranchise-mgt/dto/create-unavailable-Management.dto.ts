import { IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UnavailableTime } from '../entities/unavailable-management.entity';

export class CreateUnavailableManagementDto {
 @ApiProperty({
    type: () => UnavailableTime,
    isArray: true,
    description: 'An array of UnavailableTime objects',
    example: [
      { date: '2023-04-01', startTime: '10:00', endTime: '12:00' },
      { date: '2023-04-02', startTime: '14:00', endTime: '16:00' },
    ],
 })
 @IsNotEmpty()
 @IsArray()
 @ValidateNested({ each: true })
 @Type(() => UnavailableTime)
 unavailableTime: UnavailableTime[];
}