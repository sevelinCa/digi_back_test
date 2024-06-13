import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Income {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => DigifranchiseOwner, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "franchiseId" })
  franchiseId: DigifranchiseOwner;

  @Column({ type: "varchar", length: 255 })
  source: string;

  @Column({ type: "integer" })
  quantity: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  unityCost: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ type: "varchar", length: 255 })
  description: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  incomeDate: Date;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}
