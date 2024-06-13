import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class AvailabilityTimeSlots {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(
    () => DigifranchiseOwner,
    (ownedFranchise) => ownedFranchise.availability,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "ownedDigifranchise" })
  ownedDigifranchise: DigifranchiseOwner | null;

  @Column({ type: "boolean", default: false })
  isSlotBooked: boolean;

  @Column({ type: "boolean", default: true })
  isSlotAvailable: boolean;

  @Column({ type: "timestamp", nullable: true })
  workingDate: Date;

  @Column({ type: "varchar", length: 255 })
  day: string;

  @Column({ type: "time" })
  startTime: string;

  @Column({ type: "time" })
  endTime: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: string;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: string;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}
