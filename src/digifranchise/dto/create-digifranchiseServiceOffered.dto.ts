import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class ServiceCategoryDto {
  @ApiProperty({ example: "Sedan, Small Bakkie, Hatchback" })
  @IsNotEmpty()
  @IsString()
  serviceCategoryName: string;

  @ApiProperty({ example: "70" })
  @IsNotEmpty()
  @IsString()
  unitPrice: string;

  @ApiProperty({
    example: "A quick wash for your car exterior",
    required: false,
  })
  @IsOptional()
  @IsString()
  description: string;
}

export class CreateDigifranchiseServiceOfferedDto {
  @ApiProperty({ example: "Express Exterior Wash" })
  @IsNotEmpty()
  @IsString()
  serviceName: string;

  @ApiProperty({
    example: "A fast and efficient wash for your car",
    required: false,
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    type: [ServiceCategoryDto],
    example: [
      {
        serviceCategoryName: "Sedan, Small Bakkie, Hatchback",
        unitPrice: "70",
        description: "A quick wash for your car exterior",
      },
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceCategoryDto)
  serviceCategories?: ServiceCategoryDto[];

  @ApiProperty({
    type: [String],
    example: ["http://example.com/image1.jpg", "http://example.com/image2.jpg"],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  serviceGalleryImages?: string[];
}

export class UpdateDigifranchiseServiceOfferedDto {
  @ApiProperty({ example: "Express Exterior Wash", required: false })
  @IsOptional()
  @IsString()
  serviceName: string;

  @ApiProperty({
    example: "An updated description for the service",
    required: false,
  })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({
    type: [ServiceCategoryDto],
    required: false,
    example: [
      {
        serviceCategoryName: "Sedan, Small Bakkie, Hatchback",
        unitPrice: "75",
        description: "Updated description for the category",
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceCategoryDto)
  serviceCategories?: ServiceCategoryDto[];

  @ApiProperty({
    type: [String],
    example: ["http://example.com/image1.jpg", "http://example.com/image2.jpg"],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  serviceGalleryImages?: string[];
}
