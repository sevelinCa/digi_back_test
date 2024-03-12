import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne } from 'typeorm';
import { DigifranchiseOwner } from './digifranchise-ownership.entity';

export class OtherComplianceDocs {
  docName: string;
  link: string;
  expiryDate: string;
}


@Entity()
export class DigifranchiseComplianceInfo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => DigifranchiseOwner, owner => owner.digifranchiseId)
  @JoinColumn({ name: 'ownedDigifranchiseId' })
  digifranchiseOwner: DigifranchiseOwner;

  @Column({ nullable: true })
  ownedDigifranchiseId: string

  @Column({ nullable: true })
  companyRegisterationNumber: string 

  @Column({ nullable: true })
  taxNumber: string

  @Column({ nullable: true })
  taxClearencePin: string

  @Column({ nullable: true })
  taxClearenceExpiration: string

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

  // @Column({ type: 'json', nullable: true  })
  // uploadedDocs: UploadDocs[]

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleteAt: Date | null;
}
