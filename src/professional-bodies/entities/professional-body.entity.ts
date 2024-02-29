import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Accreditation } from './professional-accreditation.entity';

@Entity()
export class ProfessionalBodyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  professionalBodyName: string;

  @OneToMany(() => Accreditation, accreditation => accreditation.professionalBody)
  accreditations: Accreditation[]; 
}
