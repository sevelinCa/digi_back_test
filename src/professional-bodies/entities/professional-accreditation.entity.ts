import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ProfessionalBodyEntity } from "./professional-body.entity";

@Entity()
export class Accreditation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  accreditationName: string;

  @ManyToOne(() => ProfessionalBodyEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "professionalBodyId" })
  professionalBody: ProfessionalBodyEntity;

  @Column()
  professionalBodyId: string;
}
