import { FranchiseOwner } from 'src/digifranchise/entities/franchise-ownership.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Deposit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => FranchiseOwner)
  @JoinColumn({ name: 'franchiseId' })
  franchiseId: FranchiseOwner;

  @Column({ type: 'varchar' })
  item: string;

  @Column({ type: 'int' })
  monthPaid: number;

  @Column({ type: 'int' })
  monthRecovered: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  depositAmount: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  depositedAt: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleteAt: Date | null;
}
