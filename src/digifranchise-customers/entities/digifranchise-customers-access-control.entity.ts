import { Exclude, Expose } from "class-transformer";
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
import { DigifranchiseCustomers } from "./customers.entity";

@Entity()
export class DigifranchiseCustomersAccessControl {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  customerId: string;

  @ManyToOne(() => DigifranchiseCustomers, { onDelete: "CASCADE" })
  @JoinColumn({ name: 'customerId' })
  customer: DigifranchiseCustomers | null;;

  @Column({ type: "varchar" })
  digifranchiseId: string;
  
  @ManyToOne(() => Digifranchise, { onDelete: "CASCADE" })
  @JoinColumn({ name: "digifranchiseId" })
  digifranchise: Digifranchise;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  createdAt: Date | null;
}