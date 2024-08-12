import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, IsOptional } from "class-validator";

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  DECLINED = "DECLINED",
  COMPLETED = "COMPLETED",
}

export class UpdatingOrderStatusDto {
  @ApiProperty({ example: OrderStatus.PENDING, enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;
  newStatus?: string;

  @ApiProperty({ example: 'https://backend.dev.digifranchise.co.za/docs', description: 'URL to access the order.' })
  @IsString()
  @IsOptional()
  orderUrl?: string;
}