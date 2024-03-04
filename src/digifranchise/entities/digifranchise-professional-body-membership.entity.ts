import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne } from 'typeorm';

export class Documents {
  documentName: string
  link: string
  renewalDate: string
}

@Entity()
export class DigifranchiseProfessionalBodyMembership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ownedDigifranchiseId: string

  @Column()
  professionalOrganizationId: string

  @Column()
  accreditationId: string

  @Column()
  renewalDate: string

  @Column({ type: 'json' })
  documents: Documents[]

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleteAt: Date | null;
}