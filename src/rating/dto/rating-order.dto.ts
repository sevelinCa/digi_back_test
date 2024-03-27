import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MinLength, MaxLength, Min, Max, IsOptional } from 'class-validator';

export class CreateRatingOrderDto {
 @ApiProperty({ example: 5 })
 @IsNotEmpty()
 @IsInt()
 @Min(1)
 @Max(5)
 rating: number;

 @ApiProperty({ example: 'Great service!' })
 @IsNotEmpty()
 @IsString()
 @MinLength(1)
 @MaxLength(255)
 review: string;
}

export class UpdateRatingOrderDto {
 @ApiProperty({ example: 5, required: false })
 @IsOptional()
 @IsInt()
 @Min(1)
 @Max(5)
 rating?: number;

 @ApiProperty({ example: 'Excellent service!', required: false })
 @IsOptional()
 @IsString()
 @MinLength(1)
 @MaxLength(255)
 review?: string;
}