import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { CalenderEvents } from "./calender-events.entity";

@Entity()
export class CalenderEventOwner {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => CalenderEvents, { onDelete: "CASCADE" })
  @JoinColumn({ name: "eventId" })
  eventId: CalenderEvents;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  userId: UserEntity;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}
