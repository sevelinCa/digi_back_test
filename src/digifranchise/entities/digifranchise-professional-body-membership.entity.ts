import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne } from 'typeorm';
import { DigifranchiseOwner } from './digifranchise-ownership.entity';

@Entity()
export class DigifranchiseGeneralInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // General Information
  @OneToOne(() => DigifranchiseOwner)
  @JoinColumn({ name: 'ownedDigifranchiseId' })
  digifranchiseId: DigifranchiseOwner;

  @Column()
  ownedDigifranchiseId: string

  @Column()
  professionalOrganization: string

  @Column()
  accreditation: string

  @Column()
  renewelDate: string

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleteAt: Date | null;
}