import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class CalenderVenue {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column({ type: 'varchar', length: 255, nullable: true }) 
 name: string;

 @Column({ type: 'text', nullable: false }) 
 location: string;

 @Column({ type: 'int', nullable: true }) 
 capacity: number;

 @Column({ type: 'text', nullable: true }) 
 description: string;

 @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) 
 createdAt: Date;

 @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) 
 updatedAt: Date;

 @Column({ type: 'timestamp', nullable: true }) 
 deleteAt: Date | null;
}