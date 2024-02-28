import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Events } from './events.entity';

@Entity()
export class EventOwner {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @ManyToOne(() => Events, { onDelete: 'CASCADE' })
 @JoinColumn({ name: 'eventId' })
 eventId: Events;

 @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
 @JoinColumn({ name: 'userId' })
 userId: UserEntity;

 @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
 createdAt: Date;

 @Column({ type: 'timestamp', nullable: true })
 deleteAt: Date | null;
}

