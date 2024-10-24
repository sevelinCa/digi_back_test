import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum AllowedTimeSlotUnits {
  FIFTEEN_MINUTES = 15,
  THIRTY_MINUTES = 30,
  ONE_HOUR = 60,
  ONE_HOUR_AND_HALF = 90,
  TWO_HOUR = 120
}

export enum BreakTimeBetweenBookedSlots {
  FIFTEEN_MINUTES = 15,
  THIRTY_MINUTES = 30,
  ONE_HOUR = 60,
  ONE_HOUR_AND_HALF = 90
}

@Entity()
export class DigifranchiseWorkingHours {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(
    () => DigifranchiseOwner,
    (ownedFranchise) => ownedFranchise.availability,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "ownedDigifranchise" })
  @Index()
  ownedDigifranchise: DigifranchiseOwner | null;

  @Column({
    type: "enum",
    enum: AllowedTimeSlotUnits,
    default: AllowedTimeSlotUnits.THIRTY_MINUTES,
  })
  allowedTimeSlotUnits: AllowedTimeSlotUnits;

  @Column({
    type: "enum",
    enum: BreakTimeBetweenBookedSlots,
    default: BreakTimeBetweenBookedSlots.FIFTEEN_MINUTES,
  })
  breakTimeBetweenBookedSlots: BreakTimeBetweenBookedSlots;

  @Column({ type: "boolean", default: false })
  allowBookingOnPublicHolidays: boolean;

  @Column({ type: "json", nullable: true })
  availabilityWeekDays: any[];

  @Column({ type: "json", nullable: true })
  freeConsulations: any[];

  @Column({ type: "json", nullable: true })
  unavailability: any[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}
