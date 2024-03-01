import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CalenderVenue } from './calender-venues.entity';

@Entity()
export class CalenderEvents {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column({ type: 'varchar', length: 255, nullable: false })
 title: string;

 @Column({ type: 'text', nullable: true })
 description: string;

 @Column({ type: 'timestamp', nullable: false })
 startTime: Date;

 @Column({ type: 'timestamp', nullable: false })
 endTime: Date;

 @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
 @JoinColumn({ name: 'userId' })
 userId: UserEntity;

 @ManyToOne(() => CalenderVenue, { onDelete: 'SET NULL' })
 @JoinColumn({ name: 'venueId' })
 venueId: CalenderVenue;

 @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
 createdAt: Date;

 @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
 updatedAt: Date;

 @Column({ type: 'timestamp', nullable: true })
 deleteAt: Date | null;
}