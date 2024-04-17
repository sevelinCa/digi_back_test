import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';

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
export class AvailabilityWeekDays {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => Availability, availability => availability.weekDays)
    availability: Availability[];

    @OneToMany(() => AvailabilityDayTime, dayTime => dayTime.weekDay)
    dayTime: AvailabilityDayTime[];

    @ManyToOne(() => DigifranchiseOwner, ownedFranchise => ownedFranchise.availability)
    @JoinColumn({ name: 'ownedDigifranchise' })
    ownedDigifranchise: DigifranchiseOwner | null;

    @Column({ type: 'varchar', length: 255 })
    day: string;

    @Column({ type: 'boolean', default: false })
    isDayFullBooked: boolean;

    @Column({ type: 'int', default: 0 })
    availabilityCounts: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deleteAt: Date | null;
}

@Entity()
export class AvailabilityDayTime {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => AvailabilityWeekDays, weekDay => weekDay.dayTime)
    @JoinColumn({ name: 'weekDay' })
    weekDay: AvailabilityWeekDays | null;


    @ManyToOne(() => Availability, availability => availability.dayTime)
    @JoinColumn({ name: 'availability' })
    availability: Availability | null;

    @ManyToOne(() => DigifranchiseOwner, ownedFranchise => ownedFranchise.availability)
    @JoinColumn({ name: 'ownedDigifranchise' })
    ownedDigifranchise: DigifranchiseOwner | null;

    @Column({ type: 'time' })
    startTime: string;

    @Column({ type: 'time' })
    endTime: string;

    @Column({ type: 'boolean', default: false })
    isBooked: boolean;

    @Column({ type: 'json', nullable: true })
    availableTimeSlots: string[] | null;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deleteAt: Date | null;
}

@Entity()
export class Availability {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    userId: UserEntity;

    @ManyToOne(() => DigifranchiseOwner, ownedFranchise => ownedFranchise.availability)
    @JoinColumn({ name: 'ownedDigifranchise' })
    ownedDigifranchise: DigifranchiseOwner | null;

    @ManyToOne(() => AvailabilityWeekDays, weekDays => weekDays.availability)
    @JoinColumn({ name: 'weekDays' })
    weekDays: AvailabilityWeekDays | null;

    @ManyToOne(() => AvailabilityDayTime, dayTime => dayTime.availability)
    @JoinColumn({ name: 'dayTime' })
    dayTime: AvailabilityDayTime | null;

    @Column({
        type: 'enum',
        enum: AllowedTimeSlotUnits,
        default: AllowedTimeSlotUnits.THIRTY_MINUTES,
    })
    allowedTimeSlotUnits: AllowedTimeSlotUnits;

    @Column({
        type: 'enum',
        enum: BreakTimeBetweenBookedSlots,
        default: BreakTimeBetweenBookedSlots.FIFTEEN_MINUTES,
    })
    breakTimeBetweenBookedSlots: BreakTimeBetweenBookedSlots;

    @Column({ type: 'boolean', default: false })
    allowBookingOnPublicHolidays: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deleteAt: Date | null;
}

@Entity()
export class UnavailabilityWeekDays {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => Unavailability, unavailability => unavailability.weekDays)
    unavailability: Unavailability[];

    @OneToMany(() => UnavailabilityDayTime, dayTime => dayTime.weekDay)
    dayTime: UnavailabilityDayTime[];

    @ManyToOne(() => DigifranchiseOwner, ownedFranchise => ownedFranchise.availability)
    @JoinColumn({ name: 'ownedDigifranchise' })
    ownedDigifranchise: DigifranchiseOwner | null;

    @Column({ type: 'varchar', length: 255 })
    day: string;

    @Column({ type: 'boolean', default: false })
    isDayFullBooked: boolean;

    @Column({ type: 'int', default: 0 })
    availabilityCounts: number;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deleteAt: Date | null;
}
@Entity()
export class UnavailabilityDayTime {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UnavailabilityWeekDays, weekDay => weekDay.dayTime)
    @JoinColumn({ name: 'weekDay' })
    weekDay: UnavailabilityWeekDays | null;

    @ManyToOne(() => DigifranchiseOwner, ownedFranchise => ownedFranchise.availability)
    @JoinColumn({ name: 'ownedDigifranchise' })
    ownedDigifranchise: DigifranchiseOwner | null;

    @ManyToOne(() => Unavailability, unavailability => unavailability.dayTime)
    @JoinColumn({ name: 'unavailability' })
    unavailability: Unavailability | null;

    @Column({ type: 'time' })
    startTime: string;

    @Column({ type: 'time' })
    endTime: string;

    @Column({ type: 'boolean', default: false })
    isBooked: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deleteAt: Date | null;
}

@Entity()
export class Unavailability {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    userId: UserEntity;

    @ManyToOne(() => DigifranchiseOwner, ownedFranchise => ownedFranchise.availability)
    @JoinColumn({ name: 'ownedDigifranchise' })
    ownedDigifranchise: DigifranchiseOwner | null;

    @ManyToOne(() => UnavailabilityWeekDays, weekDays => weekDays.unavailability)
    @JoinColumn({ name: 'weekDays' })
    weekDays: UnavailabilityWeekDays | null;

    @ManyToOne(() => UnavailabilityDayTime, dayTime => dayTime.unavailability)
    @JoinColumn({ name: 'dayTime' })
    dayTime: UnavailabilityDayTime | null;

    @Column({
        type: 'enum',
        enum: AllowedTimeSlotUnits,
        default: AllowedTimeSlotUnits.THIRTY_MINUTES,
    })
    allowedTimeSlotUnits: AllowedTimeSlotUnits;

    @Column({
        type: 'enum',
        enum: BreakTimeBetweenBookedSlots,
        default: BreakTimeBetweenBookedSlots.FIFTEEN_MINUTES,
    })
    breakTimeBetweenBookedSlots: BreakTimeBetweenBookedSlots;

    @Column({ type: 'boolean', default: false })
    allowBookingOnPublicHolidays: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deleteAt: Date | null;
}

