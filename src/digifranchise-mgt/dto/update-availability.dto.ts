import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsOptional, IsBoolean, IsArray, IsEnum } from "class-validator";

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

export class UpdateAvailabilityDayTimeDto {
    @IsString()
    @IsOptional()
    @ApiProperty({ example: '09:00' })
    startTime?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: '17:00' })
    endTime?: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ example: false })
    isBooked?: boolean;
}

export class UpdateAvailabilityWeekDaysDto {
    @IsString()
    @IsOptional()
    @ApiProperty({ example: 'Monday' })
    day?: string;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ example: false })
    isDayFullBooked?: boolean;

    @ApiProperty({
        type: [UpdateAvailabilityDayTimeDto],
        example: [
            {
                startTime: '09:00',
                endTime: '17:00',
                isBooked: false,
            },
        ],
        required: false
    })
    @IsOptional()
    @IsArray()
    @Type(() => UpdateAvailabilityDayTimeDto)
    availabilityDayTime?: UpdateAvailabilityDayTimeDto[];
}

export class UpdateUnavailabilityDto {
    @IsString()
    @IsOptional()
    @ApiProperty({ example: '09:00' })
    startTime?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ example: '17:00' })
    endTime?: string;
}

export class UpdateAvailabilityDto {
    @IsOptional()
    @IsEnum(AllowedTimeSlotUnits)
    @ApiProperty({ example: AllowedTimeSlotUnits.THIRTY_MINUTES })
    allowedTimeSlotUnits?: AllowedTimeSlotUnits;

    @IsOptional()
    @IsEnum(BreakTimeBetweenBookedSlots)
    @ApiProperty({ example: BreakTimeBetweenBookedSlots.FIFTEEN_MINUTES })
    breakTimeBetweenBookedSlots?: BreakTimeBetweenBookedSlots;

    @IsBoolean()
    @IsOptional()
    @ApiProperty({ example: false })
    allowBookingOnPublicHolidays?: boolean;

    @ApiProperty({
        type: [UpdateAvailabilityWeekDaysDto],
        example: [
            {
                day: 'Monday',
                isDayFullBooked: false,
                availabilityDayTime: [
                    {
                        startTime: '09:00',
                        endTime: '12:00',
                    }
                ],
            }
        ],
        required: false
    })
    @IsOptional()
    @IsArray()
    @Type(() => UpdateAvailabilityWeekDaysDto)
    availabilityWeekDays?: UpdateAvailabilityWeekDaysDto[];

    @ApiProperty({
        type: [UpdateUnavailabilityDto],
        example: [
            {
                startTime: '10:00',
                endTime: '14:00',
                workingDate: '2024-10-20'
            }
        ],
        required: false,
    })
    @IsOptional()
    @IsArray()
    @Type(() => UpdateUnavailabilityDto)
    unavailability?: UpdateUnavailabilityDto[];
}
