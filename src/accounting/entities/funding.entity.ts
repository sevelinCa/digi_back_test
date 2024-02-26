import { FranchiseOwner } from 'src/digifranchise/entities/franchise-ownership.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Funding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => FranchiseOwner)
  @JoinColumn({ name: 'franchiseId' })
  franchiseId: FranchiseOwner;

  @Column({ type: 'varchar' })
  source: string;

  @Column({ type: 'int' })
  monthReceived: number;

  @Column({ type: 'int' })
  repaymentTerm: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  annualInterestRate: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fundedAt: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleteAt: Date | null;
}
