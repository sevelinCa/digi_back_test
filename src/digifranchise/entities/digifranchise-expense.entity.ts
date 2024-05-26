import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { FixedExpenseCategory } from "src/accounting/entities/fixedExpenseCategory.entity";
import { DigifranchiseOwner } from "./digifranchise-ownership.entity";

@Entity()
export class DigifranchiseExpense {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(
    () => DigifranchiseOwner,
    (ownedFranchise) => ownedFranchise.digifranchiseExpense,
  )
  @JoinColumn({ name: "ownedDigifranchise" })
  ownedDigifranchise: DigifranchiseOwner;

  @ManyToOne(
    () => FixedExpenseCategory,
    (expenseCategory) => expenseCategory.digifranchiseExpense,
  )
  @JoinColumn({ name: "fixedExpense" })
  fixedExpenseCategory: FixedExpenseCategory;

  @Column({ type: "integer" })
  quantity: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  unityCost: number;

  @Column({ type: "boolean", default: false })
  purchaseDone: boolean;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  puchaseDate: Date;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}
