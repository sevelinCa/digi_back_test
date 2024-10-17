import { Exclude, Expose } from "class-transformer";
import { Status } from "src/statuses/domain/status";
import { StatusEntity } from "src/statuses/infrastructure/persistence/relational/entities/status.entity";
import { StatusEnum } from "src/statuses/statuses.enum";
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
  ManyToOne,
} from "typeorm";

@Entity()
export class DigifranchiseCustomers {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: true })
  firstName: string;

  @Column({ type: "varchar", nullable: true })
  lastName: string;

  @Column({ type: "varchar", nullable: true })
  email: string;

  @Column({ type: "varchar", nullable: true })
  phoneNumber: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  createdAt: Date | null;
  
  @ManyToOne(()=> StatusEntity,{onDelete: "CASCADE",cascade: true})
  status: StatusEntity;

}