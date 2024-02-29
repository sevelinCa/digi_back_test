import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CalenderEvents } from './calender-events.entity';

@Entity()
export class CalenderBooking {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @ManyToOne(() => CalenderEvents, { onDelete: 'CASCADE' })
 @JoinColumn({ name: 'eventId' })
 eventId: CalenderEvents;

 @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
 @JoinColumn({ name: 'userId' })
 userId: UserEntity;

 @Column({ type: 'varchar', length: 50, nullable: false })
 status: string;

 @Column({ type: 'int', nullable: true })
 attendees: number;

 @Column({ type: 'text', nullable: true })
 notes: string;

 @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
 createdAt: Date;

 @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
 updatedAt: Date;

 @Column({ type: 'timestamp', nullable: true })
 deleteAt: Date | null;
}