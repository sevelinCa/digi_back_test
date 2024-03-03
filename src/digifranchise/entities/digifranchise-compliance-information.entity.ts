import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne } from 'typeorm';
import { DigifranchiseOwner } from './digifranchise-ownership.entity';

export class OtherComplianceDocs {
  docName: string;
  expiryDate: string;
}

export class UploadDocs {
  link: string;
}

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

  @Column({ nullable: true })
  companyRegisterationNumber: string 

  @Column({ nullable: true })
  taxNumber: string

  @Column({ nullable: true })
  taxClearencePin: string

  @Column({ type: 'timestamp', nullable: true })
  taxClearenceExpiration: Date

  @Column({ nullable: true })
  coidaRegisteration: string

  @Column({ nullable: true })
  vatNumber: string

  @Column({ nullable: true })
  uifRegistration: string

  @Column({ nullable: true })
  workMansCompensation: string

  @Column({ nullable: true })
  sdlNumber: string

  @Column({ type: 'json', nullable: true  })
  otherComplianceDocs: OtherComplianceDocs[]

  @Column({ type: 'json', nullable: true  })
  uploadedDocs: UploadDocs[]

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleteAt: Date | null;
}
