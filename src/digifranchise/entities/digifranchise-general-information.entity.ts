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
  digifranchiseName: string

  @Column()
  facebookHandle: string

  @Column()
  tiktokHandle: string

  @Column()
  instagramHandle: string

  @Column()
  xHandle: string

  @Column()
  address: string

  @Column()
  connectNumber: string

  @Column()
  otherMobileNumber: string

  @Column()
  aboutCompany: string

  @Column()
  location: string

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleteAt: Date | null;
}
