import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AllowedTimeSlotUnits {
    FIFTEEN_MINUTES = 15,
    THIRTY_MINUTES = 30,
    ONE_HOUR = 60,
    ONE_HOUR_AND_HALF = 90,
}

export enum BreakTimeBetweenBookedSlots {
    FIFTEEN_MINUTES = 15,
    THIRTY_MINUTES = 30,
    ONE_HOUR = 60,
}

export class AvailabilityWeekDaysDto {
 @IsString()
 @IsNotEmpty()
 @ApiProperty({ example: 'Monday' })
 day: string;

 @IsBoolean()
 @IsOptional()
 @ApiProperty({ example: false })
 isDayFullBooked?: boolean;

 @IsOptional()
 @ApiProperty({ example: 0 })
 availabilityCounts?: number;
}

export class AvailabilityDayTimeDto {
 @IsString()
 @IsNotEmpty()
 @ApiProperty({ example: '09:00' })
 startTime: string;

 @IsString()
 @IsNotEmpty()
 @ApiProperty({ example: '17:00' })
 endTime: string;

 @IsBoolean()
 @IsOptional()
 @ApiProperty({ example: false })
 isBooked?: boolean;
}

export class AvailabilityDto {

 @IsNotEmpty()
 @IsEnum(AllowedTimeSlotUnits)
 @ApiProperty({ example: AllowedTimeSlotUnits.THIRTY_MINUTES })
 allowedTimeSlotUnits: AllowedTimeSlotUnits;

 @IsNotEmpty()
 @IsEnum(BreakTimeBetweenBookedSlots)
 @ApiProperty({ example: BreakTimeBetweenBookedSlots.FIFTEEN_MINUTES })
 breakTimeBetweenBookedSlots: BreakTimeBetweenBookedSlots;

 @IsBoolean()
 @IsOptional()
 @ApiProperty({ example: false })
 allowBookingOnPublicHolidays?: boolean;
}

export class UnavailabilityWeekDaysDto {
 @IsString()
 @IsNotEmpty()
 @ApiProperty({ example: 'Monday' })
 day: string;

 @IsBoolean()
 @IsOptional()
 @ApiProperty({ example: false })
 isDayFullBooked?: boolean;

 @IsOptional()
 @ApiProperty({ example: 0 })
 availabilityCounts?: number;
}

export class UnavailabilityDayTimeDto {
 @IsString()
 @IsNotEmpty()
 @ApiProperty({ example: '09:00' })
 startTime: string;

 @IsString()
 @IsNotEmpty()
 @ApiProperty({ example: '17:00' })
 endTime: string;

 @IsBoolean()
 @IsOptional()
 @ApiProperty({ example: false })
 isBooked?: boolean;
}


export class UnavailabilityDto {
 @IsNotEmpty()
 @IsEnum(AllowedTimeSlotUnits)
 @ApiProperty({ example: AllowedTimeSlotUnits.THIRTY_MINUTES })
 allowedTimeSlotUnits: AllowedTimeSlotUnits;

 @IsNotEmpty()
 @IsEnum(BreakTimeBetweenBookedSlots)
 @ApiProperty({ example: BreakTimeBetweenBookedSlots.FIFTEEN_MINUTES })
 breakTimeBetweenBookedSlots: BreakTimeBetweenBookedSlots;

 @IsBoolean()
 @IsOptional()
 @ApiProperty({ example: false })
 allowBookingOnPublicHolidays?: boolean;
}