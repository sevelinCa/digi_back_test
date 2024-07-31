import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

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
}
