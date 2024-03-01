import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty, IsString, IsOptional, IsInt } from "class-validator";
import type { BookingStatusEnum } from "../entities/calender-bookings.entity";


export class CreateBookingDto {
    @ApiProperty({ description: 'The status of the booking', example: 'confirmed' })
    @IsString()
    @IsNotEmpty()
    status: BookingStatusEnum;
   
    @ApiProperty({ description: 'The number of attendees', required: false, example: 100 })
    @IsOptional()
    @IsInt()
    attendees?: number;
   
    @ApiProperty({ description: 'Notes about the booking', required: false, example: 'Special requirements for the event' })
    @IsOptional()
    @IsString()
    notes?: string;
   }


   export class UpdateBookingDto {
    @ApiProperty({ description: 'The status of the booking', example: 'confirmed' })
    @IsString()
    @IsOptional()
    status: BookingStatusEnum;
   
    @ApiProperty({ description: 'The number of attendees', required: false, example: 100 })
    @IsOptional()
    @IsInt()
    attendees?: number;
   
    @ApiProperty({ description: 'Notes about the booking', required: false, example: 'Special requirements for the event' })
    @IsOptional()
    @IsString()
    notes?: string;
   }