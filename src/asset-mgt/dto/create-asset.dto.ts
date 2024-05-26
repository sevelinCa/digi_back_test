import { IsInt, IsNotEmpty, IsString, Length, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAssetDto {
  @ApiProperty({ example: "Laptop" })
  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty({ example: 1500.0 })
  @IsNotEmpty()
  @Min(0)
  purchasePrice: number;

  @ApiProperty({ example: "2024-03-15T00:00:00Z" })
  @IsNotEmpty()
  purchaseDate: Date;

  @ApiProperty({ example: 3 })
  @IsNotEmpty()
  @IsInt()
  depreciationRate: number;
}
