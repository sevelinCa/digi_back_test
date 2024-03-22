import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { Digifranchise } from './digifranchise.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { DigifranchiseServiceCategory } from './digifranchise-service-category.entity';

@Entity()
export class DigifranchiseServiceOffered {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Digifranchise)
    @JoinColumn({ name: 'digifranchiseId' })
    digifranchiseId: Digifranchise;

    @ManyToOne(() => UserEntity, { nullable: true })
    @JoinColumn({ name: 'userId' })
    userId: UserEntity | null;

    @Column({type: 'text'})
    serviceName: string;
    
    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'varchar', length: 255 })
    unitPrice: string;

    @OneToMany(() => DigifranchiseServiceCategory, category => category.service) 
    serviceCategories: DigifranchiseServiceCategory[]; 

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deleteAt: Date | null;
}