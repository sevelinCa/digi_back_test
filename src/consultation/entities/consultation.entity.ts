import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ConsultationTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => DigifranchiseOwner,
    (ownedFranchise) => ownedFranchise.order,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: 'ownedDigifranchise' })
  ownedDigifranchise: DigifranchiseOwner | null;

  @Column({ type: 'varchar', nullable: true })
  additionalInfo: string;

  @Column({ type: 'json', nullable: true })
  bookedTimeSlots: any[];

  @Column({ type: 'json' })
  contactInfo: Object;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleteAt: Date | null;
}
