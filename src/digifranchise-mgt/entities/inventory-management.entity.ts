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
export class InventoryManagement {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  userId: UserEntity | null;

  // @ManyToOne(() => Digifranchise)
  // @JoinColumn({ name: 'digifranchiseId' })
  // digifranchiseId: Digifranchise | null;

  @ManyToOne(
    () => DigifranchiseOwner,
    (ownedFranchise) => ownedFranchise.inventory,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "ownedDigifranchise" })
  ownedDigifranchise: DigifranchiseOwner | null;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  quantity: number;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}
