import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDigiFranchiseAccountDto {
  @ApiProperty({ example: 'Electricity/Water' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
