import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";
import { Digifranchise } from "src/digifranchise/entities/digifranchise.entity";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class StaffManagement {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "userId" })
  userId: UserEntity;

  // @ManyToOne(() => Digifranchise)
  // @JoinColumn({ name: 'digifranchiseId' })
  // digifranchiseId: Digifranchise | null;

  @ManyToOne(() => DigifranchiseOwner, (ownedFranchise) => ownedFranchise.staff)
  @JoinColumn({ name: "ownedDigifranchise" })
  ownedDigifranchise: DigifranchiseOwner | null;

  @Column({ type: "text" })
  image: string;

  @Column({ type: "text" })
  fullNames: string;

  @Column({ type: "text" })
  email: string;

  @Column({ type: "text" })
  mobile_number: string;

  @Column({ type: "text" })
  id_or_passport_number: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  date_of_birth: Date;

  @Column({ type: "text" })
  role_description: string;

  @Column({ type: "text" })
  address: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  date_started: Date;

  @Column({ type: "boolean" })
  app_access: boolean;

  @Column({ type: "text" })
  registration_method: string;

  @Column({ type: "text" })
  tax_number: string;

  @Column({ type: "text" })
  uif_number: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  gross_monthly_salary: number;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}
