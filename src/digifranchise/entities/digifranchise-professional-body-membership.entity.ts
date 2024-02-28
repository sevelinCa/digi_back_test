import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne } from 'typeorm';

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
  renewelDate: string

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleteAt: Date | null;
}