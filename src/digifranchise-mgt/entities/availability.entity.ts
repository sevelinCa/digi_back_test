import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";

export enum AllowedTimeSlotUnits {
  FIFTEEN_MINUTES = 15,
  THIRTY_MINUTES = 30,
  ONE_HOUR = 60,
  ONE_HOUR_AND_HALF = 90,
}

export enum BreakTimeBetweenBookedSlots {
  FIFTEEN_MINUTES = 15,
  THIRTY_MINUTES = 30,
  ONE_HOUR = 60,
}

@Entity()
export class Availability {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  userId: UserEntity | null;

  @ManyToOne(
    () => DigifranchiseOwner,
    (ownedFranchise) => ownedFranchise.availability,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "ownedDigifranchise" })
  ownedDigifranchise: DigifranchiseOwner | null;

  @OneToMany(() => AvailabilityWeekDays, (weekDay) => weekDay.availability, {
    cascade: true,
    onDelete: "CASCADE",
  })
  weekDays: AvailabilityWeekDays[];

  @OneToMany(() => AvailabilityDayTime, (dayTime) => dayTime.availability, {
    cascade: true,
    onDelete: "CASCADE",
  })
  dayTime: AvailabilityDayTime[];

  @OneToMany(
    () => AvailabilitySlotsDetails,
    (dayTime) => dayTime.availability,
    { cascade: true, onDelete: "CASCADE" },
  )
  slotDetails: AvailabilitySlotsDetails[];

  @OneToMany(
    () => Unavailability,
    (unavailability) => unavailability.availability,
    { cascade: true, onDelete: "CASCADE" },
  )
  unavailabilities: Unavailability[];

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

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}

@Entity()
export class AvailabilityWeekDays {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Availability, (availability) => availability.weekDays, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "availabilityId" })
  availability: Availability;

  @OneToMany(() => AvailabilityDayTime, (dayTime) => dayTime.weekDay, {
    cascade: true,
    onDelete: "CASCADE",
  })
  dayTime: AvailabilityDayTime[];

  @ManyToOne(
    () => DigifranchiseOwner,
    (ownedFranchise) => ownedFranchise.availability,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "ownedDigifranchise" })
  ownedDigifranchise: DigifranchiseOwner | null;

  @ManyToOne(
    () => Unavailability,
    (workingDay) => workingDay.availabilityWeekDays,
    { onDelete: "CASCADE" },
  )
  unavailability: Unavailability[];

  @ManyToOne(
    () => AvailabilitySlotsDetails,
    (slotDetails) => slotDetails.availabilityWeekDays,
    { onDelete: "CASCADE" },
  )
  availabilitySlotsDetails: AvailabilitySlotsDetails[];

  @OneToMany(() => AvailabilityDayTime, (dayTime) => dayTime.weekDay, {
    cascade: true,
    onDelete: "CASCADE",
  })
  dayTimeSlots: AvailabilityDayTime[];

  @Column({ type: "varchar", length: 255 })
  day: string;

  @Column({ type: "timestamp", nullable: true })
  workingDate?: Date;

  @Column({ type: "boolean", default: false })
  isDayFullBooked: boolean;

  @Column({ type: "int", default: 0 })
  availabilityCounts: number;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}

@Entity()
export class AvailabilityDayTime {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => AvailabilityWeekDays, (weekDay) => weekDay.dayTime, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "weekDay" })
  weekDay: AvailabilityWeekDays | null;

  @ManyToOne(() => Availability, (availability) => availability.dayTime, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "availabilityId" })
  availability: Availability;

  @ManyToOne(
    () => DigifranchiseOwner,
    (ownedFranchise) => ownedFranchise.availability,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "ownedDigifranchise" })
  ownedDigifranchise: DigifranchiseOwner | null;

  @ManyToOne(
    () => AvailabilitySlotsDetails,
    (slotDetails) => slotDetails.availabilityDayTime,
    { onDelete: "CASCADE" },
  )
  availabilitySlotsDetails: AvailabilitySlotsDetails[];

  @Column({ type: "time" })
  startTime: string;

  @Column({ type: "time" })
  endTime: string;

  @Column({ type: "boolean", default: false })
  isBooked: boolean;

  @Column({ type: "json", nullable: true })
  availableTimeSlots: string[] | null;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}

@Entity()
export class Unavailability {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  userId: UserEntity | null;

  @ManyToOne(
    () => DigifranchiseOwner,
    (ownedFranchise) => ownedFranchise.availability,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "ownedDigifranchise" })
  ownedDigifranchise: DigifranchiseOwner | null;

  @ManyToOne(() => AvailabilityWeekDays, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "availabilityWeekDaysId" })
  availabilityWeekDays: AvailabilityWeekDays;

  @ManyToOne(
    () => Availability,
    (availability) => availability.unavailabilities,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "availabilityId" })
  availability: Availability;

  @Column({ type: "time" })
  startTime: string;

  @Column({ type: "time" })
  endTime: string;

  @Column({ type: "timestamp", nullable: true })
  workingDate?: Date;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}

@Entity()
export class AvailabilitySlotsDetails {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(
    () => AvailabilityDayTime,
    (workingHour) => workingHour.availabilitySlotsDetails,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "availabilityDayTime" })
  availabilityDayTime: AvailabilityDayTime | null;

  @ManyToOne(
    () => AvailabilityWeekDays,
    (workingDay) => workingDay.availabilitySlotsDetails,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "availabilityWeekDays" })
  availabilityWeekDays: AvailabilityWeekDays | null;

  @ManyToOne(
    () => DigifranchiseOwner,
    (ownedFranchise) => ownedFranchise.availability,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "ownedDigifranchise" })
  ownedDigifranchise: DigifranchiseOwner | null;

  @ManyToOne(
    () => Availability,
    (ownedFranchise) => ownedFranchise.slotDetails,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "availabilityId" })
  availability: Availability | null;

  @Column({ type: "boolean", default: false })
  isSlotBooked: boolean;

  @Column({ type: "json", nullable: true })
  availabilityTimeSlotsDetails: { startTime: string; endTime: string }[] | null;

  @Column({ type: "timestamp", nullable: true })
  workingDate?: Date;

  @Column({ type: "varchar", length: 255 })
  day: string;

  @Column({ type: "time" })
  startTime: string;

  @Column({ type: "time" })
  endTime: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}

@Entity()
export class AvailabilitySlotsTimeOneOne {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(
    () => AvailabilityDayTime,
    (workingHour) => workingHour.availabilitySlotsDetails,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "availabilityDayTime" })
  availabilityDayTime: AvailabilityDayTime | null;

  @ManyToOne(
    () => AvailabilityWeekDays,
    (workingDay) => workingDay.availabilitySlotsDetails,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "availabilityWeekDays" })
  availabilityWeekDays: AvailabilityWeekDays | null;

  @ManyToOne(
    () => DigifranchiseOwner,
    (ownedFranchise) => ownedFranchise.availability,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "ownedDigifranchise" })
  ownedDigifranchise: DigifranchiseOwner | null;

  @ManyToOne(
    () => Availability,
    (ownedFranchise) => ownedFranchise.slotDetails,
    { onDelete: "CASCADE" },
  )
  @JoinColumn({ name: "availabilityId" })
  availability: Availability | null;

  @Column({ type: "boolean", default: false })
  isSlotBooked: boolean;

  @Column({ type: "json", nullable: true })
  singleAvailabilityTimeSlots: { startTime: string; endTime: string }[] | null;

  @Column({ type: "timestamp", nullable: true })
  workingDate?: Date;

  @Column({ type: "varchar", length: 255 })
  day: string;

  @Column({ type: "time" })
  startTime: string;

  @Column({ type: "time" })
  endTime: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}

@Entity()
export class AvailabilityBookedSlots {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => UserEntity, { nullable: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  userId: UserEntity | null;

  @ManyToOne(() => AvailabilitySlotsTimeOneOne, { onDelete: "CASCADE" })
  @JoinColumn({ name: "slotId" })
  bookedSlotId: AvailabilitySlotsTimeOneOne;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "timestamp", nullable: true })
  deleteAt: Date | null;
}
