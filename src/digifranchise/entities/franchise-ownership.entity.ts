import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Digifranchise } from './digifranchise.entity';

@Entity()
export class FranchiseOwnership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  userFullNames: string;
  
  @ManyToOne(() => Digifranchise, digifranchise => digifranchise.franchiseOwnerships)
  digifranchise: Digifranchise;

  @Column({ type: 'varchar', length: 255, nullable: true })
  role: string; 

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleteAt: Date | null;
}
