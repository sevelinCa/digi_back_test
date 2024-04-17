import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

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

class AvailabilityDayTimeDto {
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

export class AvailabilityWeekDaysDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Monday' })
    day: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ example: false })
    isDayFullBooked?: boolean;

    @ApiProperty({
        type: [AvailabilityDayTimeDto],
        example: [
            {
                startTime: '09:00',
                endTime: '17:00',
                isBooked: false,
            },
        ],
        required: true
    })
    @IsOptional()
    @IsArray()
    @Type(() => AvailabilityDayTimeDto)
    availabilityDayTime?: AvailabilityDayTimeDto[];
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

    @ApiProperty({
        type: [AvailabilityWeekDaysDto],
        example: [
            {
                day: 'Monday',
                isDayFullBooked: false,
                availabilityDayTime: [
                    {
                        startTime: '09:00',
                        endTime: '17:00',
                        isBooked: false,
                    },
                ],
            },
            {
                day: 'Tuesday',
                isDayFullBooked: false,
                availabilityDayTime: [
                    {
                        startTime: '09:00',
                        endTime: '17:00',
                        isBooked: false,
                    },
                ],
            },
            {
                day: 'Wednesday',
                isDayFullBooked: false,
                availabilityDayTime: [
                    {
                        startTime: '09:00',
                        endTime: '17:00',
                        isBooked: false,
                    },
                ],
            },
            {
                day: 'Thursday',
                isDayFullBooked: false,
                availabilityDayTime: [
                    {
                        startTime: '09:00',
                        endTime: '17:00',
                        isBooked: false,
                    },
                ],
            },
            {
                day: 'Friday',
                isDayFullBooked: false,
                availabilityDayTime: [
                    {
                        startTime: '09:00',
                        endTime: '17:00',
                        isBooked: false,
                    },
                ],
            },
        ],
        required: true
    })
    @IsOptional()
    @IsArray()
    @Type(() => AvailabilityWeekDaysDto)
    availabilityWeekDays?: AvailabilityWeekDaysDto[];
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