import { Unavailability } from "src/digifranchise-mgt/entities/availability.entity";
import {
  IsArray,
  IsBoolean,
  IsDateString,
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
  TWO_HOUR = 120
}

export enum BreakTimeBetweenBookedSlots {
  FIFTEEN_MINUTES = 15,
  THIRTY_MINUTES = 30,
  ONE_HOUR = 60,
  ONE_HOUR_AND_HALF = 90
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
  availabilityDayTime?: AvailabilityDayTimeDto;
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

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "Sunday" })
  workingDate: string;
}

export class SetWorkingHoursDto {
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
        availabilityDayTime: {
          startTime: "09:00",
          endTime: "12:00",
        },
      },
      {
        day: "Tuesday",
        isDayFullBooked: false,
        availabilityDayTime: {
          startTime: "10:00",
          endTime: "14:00",
        },
      },
      {
        day: "Wednesday",
        isDayFullBooked: false,
        availabilityDayTime: {
          startTime: "08:00",
          endTime: "11:00",
        },
      },
      {
        day: "Thursday",
        isDayFullBooked: false,
        availabilityDayTime: {
          startTime: "09:30",
          endTime: "13:30",
        },
      },
      {
        day: "Friday",
        isDayFullBooked: false,
        availabilityDayTime: {
          startTime: "10:00",
          endTime: "15:00",
        },
      },
      {
        day: "Saturday",
        isDayFullBooked: false,
        availabilityDayTime: {
          startTime: "11:00",
          endTime: "14:00",
        },
      },
      {
        day: "Sunday",
        isDayFullBooked: false,
        availabilityDayTime: {
          startTime: "12:00",
          endTime: "16:00",
        },
      },
    ],
    required: true,
  })
  @IsOptional()
  @IsArray()
  @Type(() => AvailabilityWeekDaysDto)
  availabilityWeekDays?: AvailabilityWeekDaysDto[] | any[];

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
  unavailability?: UnavailabilityDto[];
}

export class TimeSlotDTO {
  @ApiProperty({ example: "7b9d2daf-3744-42fc-abf5-72f5d053e08e" })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ example: false })
  @IsNotEmpty()
  @IsBoolean()
  isSlotBooked: boolean;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  isSlotAvailable: boolean;

  @ApiProperty({ example: "2024-05-09T05:46:08.735Z" })
  @IsNotEmpty()
  @IsDateString()
  workingDate: string;

  @ApiProperty({ example: "Thursday" })
  @IsNotEmpty()
  @IsString()
  day: string;

  @ApiProperty({ example: "11:00:00" })
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @ApiProperty({ example: "11:30:00" })
  @IsNotEmpty()
  @IsString()
  endTime: string;

  @ApiProperty({ example: "2024-05-07T05:46:09.154Z" })
  @IsNotEmpty()
  @IsDateString()
  createdAt: string;

  @ApiProperty({ example: "2024-05-07T05:46:09.154Z" })
  @IsNotEmpty()
  @IsDateString()
  updatedAt: string;

  @ApiProperty({ example: null })
  @IsOptional()
  @IsDateString()
  deleteAt: string | null;
}
