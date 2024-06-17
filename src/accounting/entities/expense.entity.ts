import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { FixedExpenseCategory } from "./fixedExpenseCategory.entity";
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";

export enum Arrangement {
  CASH = "cash",
  CREDIT = "credit",
}

export class MonthAmount {
  month: string;
  amount: number;
}

@Entity()
export class Expense {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => DigifranchiseOwner, { onDelete: "CASCADE" })
  @JoinColumn({ name: "franchiseId" })
  franchiseId: DigifranchiseOwner;

  @ManyToOne(() => FixedExpenseCategory, { onDelete: "CASCADE" })
  @JoinColumn({ name: "fixedExpenseId" })
  fixedExpenseCategoryId: FixedExpenseCategory;

  @Column({
    type: "enum",
    enum: Arrangement,
    default: Arrangement.CASH,
  })
  arrangement: Arrangement;

  @Column({ type: "json" })
  monthlyExpense: MonthAmount[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}
