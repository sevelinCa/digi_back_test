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

export enum BookingStatusEnum {
  CONFIRMED = "confirmed",
  PENDING = "pending",
  CANCELLED = "cancelled",
  RESCHEDULED = "rescheduled",
  NO_SHOW = "no_show",
  COMPLETED = "completed",
  IN_PROGRESS = "in_progress",
}
@Entity()
export class CalenderBooking {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => CalenderEvents, { onDelete: "CASCADE" })
  @JoinColumn({ name: "eventId" })
  eventId: CalenderEvents;

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  userId: UserEntity;

  @Column({
    type: "enum",
    enum: BookingStatusEnum,
    default: BookingStatusEnum.PENDING,
  })
  status: BookingStatusEnum;

  @Column({ type: "int", nullable: true })
  attendees: number;

  @Column({ type: "text", nullable: true })
  notes: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}
