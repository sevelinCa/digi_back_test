import { IsNotEmpty, IsEnum, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { WeekDaysAndTimes, AllowedTimeSlotUnits, MinTimeBetweenBookedSlots, UnavailableTime } from '../entities/available-management.entity';

export class CreateAvailabilityManagementDto {

 @ApiProperty({
    type: () => WeekDaysAndTimes,
    isArray: true,
    description: 'An array of WeekDaysAndTimes objects',
    example: [
        { day: 'Monday', startTime: '09:00', endTime: '17:00' },
        { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
        { day: 'Wednesday', startTime: '09:00', endTime: '17:00' },
        { day: 'Thursday', startTime: '09:00', endTime: '17:00' },
        { day: 'Friday', startTime: '09:00', endTime: '17:00' },
        { day: 'Saturday', startTime: '09:00', endTime: '17:00' },
        { day: 'Sunday', startTime: '09:00', endTime: '17:00' },  
    ],
 })
 @IsNotEmpty()
 @IsArray()
 @ValidateNested({ each: true })
 @Type(() => WeekDaysAndTimes)
 weekDaysAndTimes: WeekDaysAndTimes[];

 @ApiProperty({ enum: AllowedTimeSlotUnits, default: AllowedTimeSlotUnits.THIRTY_MINUTES })
 @IsEnum(AllowedTimeSlotUnits)
 allowedTimeSlotUnits: AllowedTimeSlotUnits;

 @ApiProperty({ enum: MinTimeBetweenBookedSlots, default: MinTimeBetweenBookedSlots.FIFTEEN_MINUTES })
 @IsEnum(MinTimeBetweenBookedSlots)
 minTimeBetweenBookedSlots: MinTimeBetweenBookedSlots;

 @ApiProperty({ example: false })
 @IsBoolean()
 allowBookingOnPublicHolidays: boolean;

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