import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CalenderEvents } from './calender-events.entity';
import { CustomerManagement } from 'src/digifranchise-mgt/entities/customer-management.entity';

@Entity()
export class CalenderEventGuest{
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @ManyToOne(() => CustomerManagement, { onDelete: 'CASCADE' })
 @JoinColumn({ name: 'customerId' })
 customerId: CustomerManagement;
 
 @ManyToOne(() => CalenderEvents, { onDelete: 'CASCADE' })
 @JoinColumn({ name: 'eventId' })
 eventId: CalenderEvents;

 @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
 createdAt: Date;

 @Column({ type: 'timestamp', nullable: true })
 deleteAt: Date | null;
}

