import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, Length, IsNumber, Min } from "class-validator";

export class UpdateAssetDto {
  @ApiPropertyOptional({ example: "Laptop", description: "Name of the asset" })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  name?: string;

  @ApiPropertyOptional({
    example: 1500.0,
    description: "Purchase price of the asset",
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  purchasePrice?: number;

  @ApiPropertyOptional({
    example: "2024-03-15T00:00:00Z",
    description: "Purchase date of the asset",
  })
  @IsOptional()
  purchaseDate?: Date;

  @ApiPropertyOptional({
    example: 3,
    description: "Depreciation rate of the asset",
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  depreciationRate?: number;
}
