import {
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsString,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class WeekDaysAndTimes {
  @IsString()
  @ApiProperty({ example: "Monday" })
  day: string;

  @IsString()
  @ApiProperty({ example: "09:00" })
  startTime: string;

  @IsString()
  @ApiProperty({ example: "17:00" })
  endTime: string;
}

export enum AllowedTimeSlotUnits {
  FIFTEEN_MINUTES = 15,
  THIRTY_MINUTES = 30,
  ONE_HOUR = 60,
  ONE_HOUR_AND_HALF = 90,
}

export enum MinTimeBetweenBookedSlots {
  FIFTEEN_MINUTES = 15,
  THIRTY_MINUTES = 30,
  ONE_HOUR = 60,
}

export class UnavailableTime {
  @IsString()
  @ApiProperty({ example: "2023-04-01" })
  date: string;

  @IsString()
  @ApiProperty({ example: "10:00" })
  startTime: string;

  @IsString()
  @ApiProperty({ example: "12:00" })
  endTime: string;
}

export class CreateAvailabilityManagementDto {
  @ApiProperty({
    type: () => WeekDaysAndTimes,
    isArray: true,
    description: "An array of WeekDaysAndTimes objects",
    example: [
      { day: "Monday", startTime: "09:00", endTime: "17:00" },
      { day: "Tuesday", startTime: "09:00", endTime: "17:00" },
      { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
      { day: "Thursday", startTime: "09:00", endTime: "17:00" },
      { day: "Friday", startTime: "09:00", endTime: "17:00" },
      { day: "Saturday", startTime: "09:00", endTime: "17:00" },
      { day: "Sunday", startTime: "09:00", endTime: "17:00" },
    ],
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WeekDaysAndTimes)
  weekDaysAndTimes: WeekDaysAndTimes[];

  @ApiProperty({
    enum: AllowedTimeSlotUnits,
    default: AllowedTimeSlotUnits.THIRTY_MINUTES,
  })
  @IsEnum(AllowedTimeSlotUnits)
  allowedTimeSlotUnits: AllowedTimeSlotUnits;

  @ApiProperty({
    enum: MinTimeBetweenBookedSlots,
    default: MinTimeBetweenBookedSlots.FIFTEEN_MINUTES,
  })
  @IsEnum(MinTimeBetweenBookedSlots)
  minTimeBetweenBookedSlots: MinTimeBetweenBookedSlots;

  @ApiProperty({ example: false })
  @IsBoolean()
  allowBookingOnPublicHolidays: boolean;

  @ApiProperty({
    type: () => UnavailableTime,
    isArray: true,
    description: "An array of UnavailableTime objects",
    example: [
      { date: "2023-04-01", startTime: "10:00", endTime: "12:00" },
      { date: "2023-04-02", startTime: "14:00", endTime: "16:00" },
    ],
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UnavailableTime)
  unavailableTime: UnavailableTime[];
}

export class UpdateAvailabilityManagementDto {
  @ApiProperty({
    type: () => WeekDaysAndTimes,
    isArray: true,
    description: "An array of WeekDaysAndTimes objects",
    example: [
      { day: "Monday", startTime: "09:00", endTime: "17:00" },
      { day: "Tuesday", startTime: "09:00", endTime: "17:00" },
      { day: "Wednesday", startTime: "09:00", endTime: "17:00" },
      { day: "Thursday", startTime: "09:00", endTime: "17:00" },
      { day: "Friday", startTime: "09:00", endTime: "17:00" },
      { day: "Saturday", startTime: "09:00", endTime: "17:00" },
      { day: "Sunday", startTime: "09:00", endTime: "17:00" },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WeekDaysAndTimes)
  weekDaysAndTimes?: WeekDaysAndTimes[];

  @ApiProperty({
    enum: AllowedTimeSlotUnits,
    default: AllowedTimeSlotUnits.THIRTY_MINUTES,
  })
  @IsOptional()
  @IsEnum(AllowedTimeSlotUnits)
  allowedTimeSlotUnits?: AllowedTimeSlotUnits;

  @ApiProperty({
    enum: MinTimeBetweenBookedSlots,
    default: MinTimeBetweenBookedSlots.FIFTEEN_MINUTES,
  })
  @IsOptional()
  @IsEnum(MinTimeBetweenBookedSlots)
  minTimeBetweenBookedSlots?: MinTimeBetweenBookedSlots;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  allowBookingOnPublicHolidays?: boolean;

  @ApiProperty({
    type: () => UnavailableTime,
    isArray: true,
    description: "An array of UnavailableTime objects",
    example: [
      { date: "2023-04-01", startTime: "10:00", endTime: "12:00" },
      { date: "2023-04-02", startTime: "14:00", endTime: "16:00" },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UnavailableTime)
  unavailableTime?: UnavailableTime[];
}
