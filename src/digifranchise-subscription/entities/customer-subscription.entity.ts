import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Digifranchise } from "src/digifranchise/entities/digifranchise.entity";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";

@Entity()
export class CustomerSubscription {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: "userId" })
  userId: UserEntity;

  @ManyToOne(() => DigifranchiseOwner)
  @JoinColumn({ name: "digifranchiseOwnerId" })
  digifranchiseOwnerId: DigifranchiseOwner;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}
