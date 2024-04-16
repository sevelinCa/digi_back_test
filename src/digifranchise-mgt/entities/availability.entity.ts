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
export class availabilityWeekDays {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => availability, availability => availability.weekDays)
    availability: availability[];

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
export class availabilityDayTime {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => availability, availability => availability.dayTime)
    availability: availability[];

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
export class availability {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    userId: UserEntity;

    @ManyToOne(() => DigifranchiseOwner, ownedFranchise => ownedFranchise.availability)
    @JoinColumn({ name: 'ownedDigifranchise' })
    ownedDigifranchise: DigifranchiseOwner | null;

    @ManyToOne(() => availabilityWeekDays, weekDays => weekDays.availability)
    @JoinColumn({ name: 'weekDays' })
    weekDays: availabilityWeekDays | null;

    @ManyToOne(() => availabilityDayTime, dayTime => dayTime.availability)
    @JoinColumn({ name: 'dayTime' })
    dayTime: availabilityDayTime | null;

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
export class unavailabilityWeekDays {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => unavailability, unavailability => unavailability.weekDays)
    unavailability: unavailability[];

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
export class unavailabilityDayTime {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToMany(() => unavailability, unavailability => unavailability.dayTime)
    unavailability: unavailability[];

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
export class unavailability {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    userId: UserEntity;

    @ManyToOne(() => DigifranchiseOwner, ownedFranchise => ownedFranchise.availability)
    @JoinColumn({ name: 'ownedDigifranchise' })
    ownedDigifranchise: DigifranchiseOwner | null;

    @ManyToOne(() => unavailabilityWeekDays, weekDays => weekDays.unavailability)
    @JoinColumn({ name: 'weekDays' })
    weekDays: unavailabilityWeekDays | null;

    @ManyToOne(() => unavailabilityDayTime, dayTime => dayTime.unavailability)
    @JoinColumn({ name: 'dayTime' })
    dayTime: unavailabilityDayTime | null;

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

