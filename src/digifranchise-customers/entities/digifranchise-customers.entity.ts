import { Expose } from "class-transformer";
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
  DeleteDateColumn,
} from "typeorm";

@Entity()
export class DigifranchiseCustomers {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  customerId: string;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'customerId' })
  customer: UserEntity | null;;

  @Column({ type: "varchar", length: 255 })
  digifranchiseId: string;
  
  @ManyToOne(() => Digifranchise, { onDelete: "CASCADE" })
  @JoinColumn({ name: "digifranchiseId" })
  digifranchise: Digifranchise;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  createdAt: Date | null;
}