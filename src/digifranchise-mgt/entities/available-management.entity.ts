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

export class WeekDaysAndTimes {
  day: string;
  startTime: string;
  endTime: string;
}

export class UnavailableTime {
  date: string;
  startTime: string;
  endTime: string;
}
export enum AllowedTimeSlotUnits {
  FIFTEEN_MINUTES = 15,
  THIRTY_MINUTES = 30,
  ONE_HOUR = 60,
  ONE_HOUR_AND_HALF = 90,
}

export enum MinTimeBetweenBookedSlots {
  FIFTEEN_MINUTES = 15,
  THIRTY_MINUTES = 30,
  ONE_HOUR = 60,
}

@Entity()
export class AvailableManagement {
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: "userId" })
  userId: UserEntity | null;

  // @ManyToOne(() => Digifranchise, { nullable: true })
  // @JoinColumn({ name: 'digifranchiseId' })
  // digifranchiseId: Digifranchise | null;

  @ManyToOne(
    () => DigifranchiseOwner,
    (ownedFranchise) => ownedFranchise.availability,
    { onDelete: 'CASCADE' }
  )
  @JoinColumn({ name: "ownedDigifranchise" })
  ownedDigifranchise: DigifranchiseOwner | null;

  @Column({ type: "json" })
  weekDaysAndTimes: WeekDaysAndTimes[];

  @Column({
    type: "enum",
    enum: AllowedTimeSlotUnits,
    default: AllowedTimeSlotUnits.THIRTY_MINUTES,
  })
  allowedTimeSlotUnits: AllowedTimeSlotUnits;

  @Column({
    type: "enum",
    enum: MinTimeBetweenBookedSlots,
    default: MinTimeBetweenBookedSlots.FIFTEEN_MINUTES,
  })
  minTimeBetweenBookedSlots: MinTimeBetweenBookedSlots;

  @Column({ type: "boolean", default: false })
  allowBookingOnPublicHolidays: boolean;

  @Column({ type: "json" })
  unavailableTime: UnavailableTime[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}
