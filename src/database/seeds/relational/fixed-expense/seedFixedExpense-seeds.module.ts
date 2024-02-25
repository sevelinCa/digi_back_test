import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FixedExpenseSeedService } from './seedFixedExpense-seeds.service';
import { FixedExpenseCategory } from 'src/accounting/entities/fixedExpenseCategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FixedExpenseCategory])],
  providers: [FixedExpenseSeedService],
  exports: [FixedExpenseSeedService],
})
export class FixedExpenseSeedModule {}
