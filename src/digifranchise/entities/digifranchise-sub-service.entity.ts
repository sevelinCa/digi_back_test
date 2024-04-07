import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { DigifranchiseServiceOffered } from './digifranchise-service-offered.entity';
import { DigifranchiseGalleryImage } from './digifranchise-gallery-images.entity';
import { DigifranchiseSubServiceCategory } from './digifranchise-sub-service-category.entity';
import { DigifranchiseOwner } from './digifranchise-ownership.entity';

@Entity()
export class DigifranchiseSubServices {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => DigifranchiseServiceOffered)
    @JoinColumn({ name: 'digifranchiseServiceId' })
    digifranchiseServiceId: DigifranchiseServiceOffered;

    @OneToMany(() => DigifranchiseSubServiceCategory, subCategory => subCategory.subService)
    subServiceCategories: DigifranchiseSubServiceCategory[];

    @OneToMany(() => DigifranchiseGalleryImage, image => image.subService)
    subServiceGalleryImages: DigifranchiseGalleryImage[];

    @ManyToOne(() => DigifranchiseOwner, subs => subs.subService, { nullable: true })
    @JoinColumn({ name: 'digifranchiseOwnedId' })
    digifranchiseOwnedId: DigifranchiseOwner | null;

    @ManyToOne(() => UserEntity, { nullable: true })
    @JoinColumn({ name: 'userId' })
    userId: UserEntity | null;

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


