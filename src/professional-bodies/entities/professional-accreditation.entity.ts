import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProfessionalBodyEntity } from './professional-body.entity';

@Entity()
export class Accreditation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  accreditationName: string;

  @ManyToOne(() => ProfessionalBodyEntity, professionalBody => professionalBody.accreditations)
  professionalBody: ProfessionalBodyEntity;
}