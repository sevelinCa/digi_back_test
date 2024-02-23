import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Inventory } from './inventory.entity';

@Entity()
export class InventoryEntries {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'quantity' })
  quantity: number;

  @Column({ name: 'costPerItem' })
  costPerItem: number;

  @Column({ name: 'totalValue' })
  totalValue?: number;

  @Column({ type: 'timestamp' })
  dateReceived: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleteAt: Date | null;

  @Column({ type: 'uuid' })
  inventoryId: string;

  @ManyToOne(() => Inventory, inventory => inventory.entries)
  @JoinColumn({ name: 'inventoryId' })
  inventory: Inventory;
}
