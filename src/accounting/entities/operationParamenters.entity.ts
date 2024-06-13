import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from "typeorm";

@Entity()
export class OperatingParameters {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  
  @ManyToOne(() => DigifranchiseOwner, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "franchiseId" })
  franchiseId: DigifranchiseOwner;

  @Column({ type: "decimal", precision: 5, scale: 2 })
  salesPaidByCreditCard: number;

  @Column({ type: "decimal", precision: 5, scale: 2 })
  salesMadeOnCredit: number;

  @Column({ type: "int" })
  averageCreditorTerms: number;

  @Column({ type: "int" })
  averageDebtorTerms: number;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  operatedAt: Date;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}
