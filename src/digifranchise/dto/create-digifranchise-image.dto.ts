import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateDigifranchiseGalleryImageDto {
 @ApiProperty({ example: 'http://example.com/image1.jpg' })
 @IsString()
 imageUrl: string;
}

export class UpdateDigifranchiseGalleryImageDto {
 @ApiProperty({ example: 'http://example.com/image1.jpg' })
 @IsOptional()
 @IsString()
 imageUrl?: string;
}