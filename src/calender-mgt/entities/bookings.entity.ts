import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Events } from './events.entity';

@Entity()
export class Booking {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @ManyToOne(() => Events, { onDelete: 'CASCADE' })
 @JoinColumn({ name: 'eventId' })
 eventId: Events;

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