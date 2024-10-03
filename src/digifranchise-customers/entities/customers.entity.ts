import { Exclude, Expose } from "class-transformer";
// import { Digifranchise } from "src/digifranchise/entities/digifranchise.entity";
// import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  // CreateDateColumn,
  // JoinColumn,
  // ManyToOne,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity()
export class DigifranchiseCustomers {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: true })
  email: string;

  @Column({ type: "varchar", nullable: true })
  phoneNumber: string;

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