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
import { FranchiseOwner } from 'src/digifranchise/entities/franchise-ownership.entity';

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

  @ManyToOne(() => FranchiseOwner)
  @JoinColumn({ name: 'franchiseId' })
  franchiseId: FranchiseOwner;

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

  @Column({ type: 'timestamp', nullable: true })
  deleteAt: Date | null;
}
