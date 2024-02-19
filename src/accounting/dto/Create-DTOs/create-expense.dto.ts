import { IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Arrangement, MonthAmount } from '../../entities/expense.entity';

export class CreateExpenseDto {
  @ApiProperty({ example: 'cash' })
  @IsEnum(Arrangement)
  @IsNotEmpty()
  arrangement: Arrangement;

  @ApiProperty({
    type: () => MonthAmount,
    isArray: true,
    description: 'An array of MonthAmount objects',
    example: [
      { month: 'January', amount: 100.0 },
      { month: 'February', amount: 200.0 },
    ],
  })
  @IsNotEmpty()
  monthlyExpense: MonthAmount[];
}
