import { Unavailability } from "src/digifranchise-mgt/entities/availability.entity";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";

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

export class AvailabilityDayTimeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "09:00" })
  startTime: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "17:00" })
  endTime: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: false })
  isBooked?: boolean;
}

export class AvailabilityWeekDaysDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "Monday" })
  day: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: false })
  isDayFullBooked?: boolean;

  @ApiProperty({
    type: [AvailabilityDayTimeDto],
    example: [
      {
        startTime: "09:00",
        endTime: "17:00",
        isBooked: false,
      },
    ],
    required: true,
  })
  @IsOptional()
  @IsArray()
  @Type(() => AvailabilityDayTimeDto)
  availabilityDayTime?: AvailabilityDayTimeDto[];
}

export class UnavailabilityDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "09:00" })
  startTime: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "17:00" })
  endTime: string;
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
        day: "Monday",
        isDayFullBooked: false,
        availabilityDayTime: [
          {
            startTime: "09:00",
            endTime: "12:00",
          },
        ],
      },
      {
        day: "Tuesday",
        isDayFullBooked: false,
        availabilityDayTime: [
          {
            startTime: "10:00",
            endTime: "14:00",
          },
        ],
      },
      {
        day: "Wednesday",
        isDayFullBooked: false,
        availabilityDayTime: [
          {
            startTime: "08:00",
            endTime: "11:00",
          },
        ],
      },
      {
        day: "Thursday",
        isDayFullBooked: false,
        availabilityDayTime: [
          {
            startTime: "09:30",
            endTime: "13:30",
          },
        ],
      },
      {
        day: "Friday",
        isDayFullBooked: false,
        availabilityDayTime: [
          {
            startTime: "10:00",
            endTime: "15:00",
          },
        ],
      },
      {
        day: "Saturday",
        isDayFullBooked: false,
        availabilityDayTime: [
          {
            startTime: "11:00",
            endTime: "14:00",
          },
        ],
      },
      {
        day: "Sunday",
        isDayFullBooked: false,
        availabilityDayTime: [
          {
            startTime: "12:00",
            endTime: "16:00",
          },
        ],
      },
    ],
    required: true,
  })
  @IsOptional()
  @IsArray()
  @Type(() => AvailabilityWeekDaysDto)
  availabilityWeekDays?: AvailabilityWeekDaysDto[];

  @ApiProperty({
    type: [UnavailabilityDto],
    example: [
      {
        startTime: "10:00",
        endTime: "14:00",
        workingDate: "2024-10-20",
      },
    ],
    required: true,
  })
  @IsOptional()
  @IsArray()
  @Type(() => Unavailability)
  unavailability: UnavailabilityDto[];
}
