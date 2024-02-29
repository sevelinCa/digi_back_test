import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne } from 'typeorm';
import { DigifranchiseOwner } from './digifranchise-ownership.entity';

@Entity()
export class DigifranchiseComplianceInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // General Information
  // @OneToOne(() => DigifranchiseOwner)
  // @JoinColumn({ name: 'ownedDigifranchiseId' })
  // digifranchiseId: DigifranchiseOwner;

  @Column()
  ownedDigifranchiseId: string

  @Column()
  companyRegisterationNumber: string 

  @Column()
  taxNumber: string

  @Column()
  taxClearencePin: string

  @Column()
  coidaRegisteration: string

  @Column()
  uifRegistration: string

  @Column()
  workMansCompensation: string

  @Column()
  sdlNumber: string

  @Column()
  otherComplianceDocs: string

  @Column()
  uploadedDocs: string

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleteAt: Date | null;
}
