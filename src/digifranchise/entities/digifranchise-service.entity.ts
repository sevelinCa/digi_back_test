import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Digifranchise } from './digifranchise.entity';

@Entity()
export class DigifranchiseServiceTable {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Digifranchise, digifranchise => digifranchise.services)
    digifranchise: Digifranchise;

    @Column({type: 'text'})
    serviceName: string;
    
    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'varchar', length: 255 })
    unitPrice: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deleteAt: Date | null;
}


