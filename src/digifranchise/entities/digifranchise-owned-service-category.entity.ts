import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { DigifranchiseOwnedServiceOffered } from './digifranchise-owned-service-offered.entity';

@Entity()
export class DigifranchiseOwnedServiceCategory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    serviceCategoryName: string;

    @Column({ type: 'varchar', length: 255 })
    unitPrice: string;

    @Column({ type: 'text' })
    description: string;

    @ManyToOne(() => DigifranchiseOwnedServiceOffered, ownedService => ownedService.ownedServiceCategories) 
    @JoinColumn({ name: 'ownedServiceId' }) 
    ownedService: DigifranchiseOwnedServiceOffered;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deleteAt: Date | null;
}