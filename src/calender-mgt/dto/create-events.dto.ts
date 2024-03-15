import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";


export class CreateEventDto {
    @ApiProperty({ description: 'The title of the event', example: 'Tech Conference' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'The start time of the event', type: Date, example: '2023-04-01T09:00:00Z' })
    @IsNotEmpty()
    startTime: Date;

    @ApiProperty({ description: 'The end time of the event', type: Date, example: '2023-04-02T17:00:00Z' })
    @IsNotEmpty()
    endTime: Date;

    @ApiProperty({ example: '2024-03-15T00:00:00Z' })
    @IsNotEmpty()
    eventDate: Date;
}

export class UpdateEventDto {
    @ApiProperty({ description: 'The title of the event', example: 'Tech Conference' })
    @IsString()
    @IsOptional()
    title: string;

    @ApiProperty({ description: 'A description of the event', required: false, example: 'An annual tech conference' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'The start time of the event', type: Date, example: '2023-04-01T09:00:00Z' })
    @IsOptional()
    startTime: Date;

    @ApiProperty({ description: 'The end time of the event', type: Date, example: '2023-04-02T17:00:00Z' })
    @IsOptional()
    endTime: Date;

    @ApiProperty({ example: '2024-03-15T00:00:00Z' })
    @IsNotEmpty()
    eventDate: Date;
}