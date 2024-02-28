import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateVenueDto {
 @ApiProperty({ description: 'The name of the venue', example: 'Conference Hall 1' })
 @IsString()
 @IsNotEmpty()
 name: string;

 @ApiProperty({ description: 'The location of the venue', example: '123 Main St, Anytown' })
 @IsString()
 @IsNotEmpty()
 location: string;

 @ApiProperty({ description: 'The capacity of the venue', required: false, example: 500 })
 @IsOptional()
 @IsInt()
 capacity?: number;

 @ApiProperty({ description: 'A description of the venue', required: false, example: 'A large hall with a stage' })
 @IsOptional()
 @IsString()
 description?: string;
}



