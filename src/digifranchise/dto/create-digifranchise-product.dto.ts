import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateDigifranchiseProductdDto {
  @ApiProperty({ example: "Phone Training Sessions 1-on-1" })
  @IsNotEmpty()
  @IsString()
  productName: string;

  @ApiProperty({ example: "Phone Training Sessions" })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: "200" })
  @IsNotEmpty()
  @IsString()
  unitPrice: string;

  @ApiProperty({
    type: [String],
    example: ["http://example.com/image1.jpg", "http://example.com/image2.jpg"],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productGalleryImages?: string[];
}

export class UpdateDigifranchiseProductDto {
  @ApiProperty({ example: "Phone Training Sessions 1-on-1" })
  @IsOptional()
  @IsString()
  productName: string;

  @ApiProperty({ example: "Phone Training Sessions" })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ example: "200" })
  @IsOptional()
  @IsString()
  unitPrice: string;

  @ApiProperty({
    type: [String],
    example: ["http://example.com/image1.jpg", "http://example.com/image2.jpg"],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productGalleryImages?: string[];
}
