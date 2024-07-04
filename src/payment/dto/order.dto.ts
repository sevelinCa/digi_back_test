import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsInt,
  Min,
  IsEnum,
  IsOptional,
  IsArray,
  IsString,
  IsNumber,
  IsBoolean,
} from "class-validator";

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export class CreateOrderTableDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: OrderStatus.PENDING, enum: OrderStatus })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({ example: "2024-03-15T00:00:00Z" })
  @IsNotEmpty()
  orderDate: Date;

  @ApiProperty({
    example: [
      {
        basic_info: {
          name: "Alex Smith",
          email: "alex.smith@example.com",
          address: "123 Main St, Anytown, AT 12345",
          phoneNumber: "123-456-7890",
        },
      },
      {
        availability: [
          {
            createdAt: "2024-06-18T12:45:30.529Z",
            day: "Thursday",
            deleteAt: null,
            endTime: "03:58:00",
            id: "080fbe27-e1a3-4364-a252-c13a032c300e",
            isSlotAvailable: true,
            isSlotBooked: false,
            startTime: "03:43:00",
            updatedAt: "2024-06-18T12:45:30.529Z",
            workingDate: "2024-06-27T12:44:25.432Z",
          },
        ],
      },
      {
        academicLevel: "High School",
        subjectToBeTutored: "Mathematics",
        grade: "10",
      },
    ],
    type: () => [Object],
  })
  @IsArray()
  orderAdditionalInfo: any[];

  @ApiProperty({ example: 100.0 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  useEscrow?: boolean;
}

export class UpdateOrderTableDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @ApiProperty({
    example: OrderStatus.PENDING,
    enum: OrderStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiProperty({
    example: [
      {
        Name: "Alex Smith",
        Email: "alex.smith@example.com",
        Address: "123 Main St, Anytown, AT 12345",
      },
      {
        availability: [
          {
            createdAt: "2024-06-18T12:45:30.529Z",
            day: "Thursday",
            deleteAt: null,
            endTime: "03:58:00",
            id: "080fbe27-e1a3-4364-a252-c13a032c300e",
            isSlotAvailable: true,
            isSlotBooked: false,
            startTime: "03:43:00",
            updatedAt: "2024-06-18T12:45:30.529Z",
            workingDate: "2024-06-27T12:44:25.432Z",
          },
        ],
      },
      {
        AcademicLevel: "High School",
        SubjectToBeTutored: "Mathematics",
        Grade: "10",
      },
    ],
    type: () => [Object],
    required: false,
  })
  @IsOptional()
  @IsArray()
  orderAdditionalInfo?: any[];

  @ApiProperty({ example: 100.0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;
}

export class CreateOrderBasicInfo {
  @ApiProperty({ example: "John Doe" })
  @IsNotEmpty()
  @IsString()
  fullNames: string;

  @ApiProperty({ example: "+1234567890" })
  @IsNotEmpty()
  @IsString()
  contactDetails: string;

  @ApiProperty({ example: "123 Main St, Anytown, Anystate, 12345" })
  @IsNotEmpty()
  @IsString()
  address: string;
}

export class UpdateOrderBasicInfo {
  @ApiProperty({ example: "Jane Doe", required: false })
  @IsOptional()
  @IsString()
  fullNames?: string;

  @ApiProperty({ example: "+0987654321", required: false })
  @IsOptional()
  @IsString()
  contactDetails?: string;

  @ApiProperty({
    example: "456 Elm St, Anytown, Anystate, 67890",
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;
}
