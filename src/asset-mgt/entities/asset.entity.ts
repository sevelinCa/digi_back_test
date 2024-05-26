import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Asset {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => DigifranchiseOwner)
  @JoinColumn({ name: "franchiseId" })
  franchiseId: DigifranchiseOwner;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  purchasePrice: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  purchaseDate: Date;

  @Column({ type: "integer" })
  depreciationRate: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  currentValue: number;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}
