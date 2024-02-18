import { DigifranchiseAccount } from 'src/digifranchise/entities/digifranchise-account.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { FixedExpenseCategory } from './fixedExpenseCategory.entity';

export enum Arrangement {
  CASH = 'cash',
  CREDIT = 'credit',
}

export class MonthAmount {
  month: string;
  amount: number;
}
@Entity()
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DigifranchiseAccount)
  @JoinColumn({ name: 'franchiseId' })
  franchiseId: DigifranchiseAccount;

  @ManyToOne(() => FixedExpenseCategory)
  @JoinColumn({ name: 'fixedExpenseId' })
  fixedExpenseCategoryId: FixedExpenseCategory;

  @Column({
    type: 'enum',
    enum: Arrangement,
    default: Arrangement.CASH,
  })
  arrangement: Arrangement;

  @Column({ type: 'json' })
  monthlyExpense: MonthAmount[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
