import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty, IsString, IsOptional, IsInt } from "class-validator";


export class CreateBookingDto {
    @ApiProperty({ description: 'The status of the booking', example: 'confirmed' })
    @IsString()
    @IsNotEmpty()
    status: string;
   
    @ApiProperty({ description: 'The number of attendees', required: false, example: 100 })
    @IsOptional()
    @IsInt()
    attendees?: number;
   
    @ApiProperty({ description: 'Notes about the booking', required: false, example: 'Special requirements for the event' })
    @IsOptional()
    @IsString()
    notes?: string;
   }