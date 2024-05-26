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
export class EnquiriesTable {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => DigifranchiseOwner)
  @JoinColumn({ name: "digifranchiseOwnerId" })
  digifranchiseOwnerId: DigifranchiseOwner;

  @Column({ type: "text" })
  names: string;

  @Column({ type: "integer" })
  phone_number: number;

  @Column({ type: "text" })
  email: string;

  @Column({ type: "text" })
  description: string;
  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}
