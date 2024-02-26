import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Digifranchise } from './digifranchise.entity';

@Entity()
export class DigifranchiseServiceOffered {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Digifranchise)
    @JoinColumn({ name: 'digifranchiseId' })
    digifranchiseId: Digifranchise;

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


