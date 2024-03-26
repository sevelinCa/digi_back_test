import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MinLength, MaxLength, Min } from 'class-validator';

export class CreateEnquiriesTableDto {
 @ApiProperty({ example: 'John Doe' })
 @IsString()
 @MinLength(1)
 @MaxLength(255)
 names: string;

 @ApiProperty({ example: 1234567890 })
 @IsInt()
 @Min(1)
 phone_number: number;

 @ApiProperty({ example: 'john.doe@example.com' })
 @IsString()
 @MinLength(1)
 @MaxLength(255)
 email: string;

 @ApiProperty({ example: 'I have a question about your services.' })
 @IsString()
 @MinLength(1)
 @MaxLength(255)
 description: string;
}

export class UpdateEnquiriesTableDto {
 @ApiProperty({ example: 'John Doe', required: false })
 @IsOptional()
 @IsString()
 @MinLength(1)
 @MaxLength(255)
 names?: string;

 @ApiProperty({ example: 1234567890, required: false })
 @IsOptional()
 @IsInt()
 @Min(1)
 phone_number?: number;

 @ApiProperty({ example: 'john.doe@example.com', required: false })
 @IsOptional()
 @IsString()
 @MinLength(1)
 @MaxLength(255)
 email?: string;

 @ApiProperty({ example: 'I have a question about your services.', required: false })
 @IsOptional()
 @IsString()
 @MinLength(1)
 @MaxLength(255)
 description?: string;
}