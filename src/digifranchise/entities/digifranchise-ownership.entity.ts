import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Digifranchise } from './digifranchise.entity';

@Entity()
export class DigifranchiseOwner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  digifranchiseId: string

  @ManyToOne(() => Digifranchise)
  @JoinColumn({ name: 'digifranchise' })
  digifranchise: Digifranchise;


  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleteAt: Date | null;
}
