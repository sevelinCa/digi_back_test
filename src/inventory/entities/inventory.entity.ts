import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { InventoryEntries } from "./inventory-entries.entity";

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "franchiseId" })
  franchiseId: string;

  @Column({ type: "varchar", length: 255 })
  itemName: string;

  @OneToMany(() => InventoryEntries, (entry) => entry.inventory, { cascade: true, onDelete: "CASCADE" })
  entries: InventoryEntries[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}
