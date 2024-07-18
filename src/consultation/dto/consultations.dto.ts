import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsArray,
  IsObject,
  IsDateString,
} from 'class-validator';

export class CreateConsultationTableDto {
  @ApiProperty({
    description: 'Additional information about the consultation',
    type: String,
    required: false,
    example: 'Anything else you would like to share with us',
  })
  @IsString()
  @IsOptional()
  additionalInfo: string;

  @ApiProperty({
    description: 'Booked time slots for the consultation',
    type: [Object],
    required: false,
    example: [
      {
        id: '186ad363-ca15-459f-9c03-dca4ee969ddd',
        isSlotBooked: false,
        isSlotAvailable: true,
        workingDate: '2024-07-18T00:00:01.409Z',
        day: 'Thursday',
        startTime: '09:00:00',
        endTime: '09:30:00',
        createdAt: '2024-07-01T00:00:21.792Z',
        updatedAt: '2024-07-01T00:00:21.792Z',
        deleteAt: null,
      },
    ],
  })
  @IsArray()
  @IsOptional()
  bookedTimeSlots: any[];

  @ApiProperty({
    description: 'Contact information for the consultation',
    type: Object,
    example: {
      email: 'test@example.com',
      names: 'Tester Full',
      phone: '+2772123514',
      address: 'Luanda, Angola',
    },
  })
  @IsObject()
  @IsNotEmpty()
  contactInfo: object;

  @ApiProperty({
    description: 'Creation timestamp',
    type: String,
    format: 'date-time',
    example: '2024-06-18T12:45:30.529Z',
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    description: 'Update timestamp',
    type: String,
    format: 'date-time',
    example: '2024-06-18T12:45:30.529Z',
  })
  @IsDateString()
  updatedAt: Date;

  @ApiProperty({
    description: 'Deletion timestamp',
    type: String,
    format: 'date-time',
    required: false,
    example: '2024-06-18T12:45:30.529Z',
  })
  @IsDateString()
  @IsOptional()
  deleteAt: Date | null;
}
