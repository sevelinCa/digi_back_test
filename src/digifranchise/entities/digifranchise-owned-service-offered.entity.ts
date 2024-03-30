// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from 'typeorm';
// import { DigifranchiseServiceCategory } from './digifranchise-service-category.entity';
// import { DigifranchiseGalleryImage } from './digifranchise-gallery-images.entity';
// import { DigifranchiseOwner } from './digifranchise-ownership.entity';
// import { DigifranchiseSubServices } from './digifranchise-sub-service.entity';
// import { DigifranchiseOwnedServiceCategory } from './digifranchise-owned-service-category.entity';

// @Entity()
// export class DigifranchiseOwnedServiceOffered {
//     @PrimaryGeneratedColumn('uuid')
//     id: string;

//     @ManyToOne(() => DigifranchiseOwner)
//     @JoinColumn({ name: 'ownedDigifranchiseId' })
//     ownedDigifranchiseId: DigifranchiseOwner;

//     @OneToMany(() => DigifranchiseSubServices, subService => subService.digifrachiseServiceId, { nullable: true })
//     subServices: DigifranchiseSubServices[];

//     @Column({ type: 'text' })
//     serviceName: string;

//     @Column({ type: 'text' })
//     description: string;

//     @Column({ type: 'varchar', length: 255 })
//     unitPrice: string;

//     @OneToMany(() => DigifranchiseOwnedServiceCategory, category => category.ownedService)
//     ownedServiceCategories: DigifranchiseOwnedServiceCategory[];

//     @Column({ type: 'boolean', default: false })
//     isSelected: boolean;

//     @OneToMany(() => DigifranchiseGalleryImage, image => image.digifranchiseServiceId)
//     galleryImages: DigifranchiseGalleryImage[];

//     @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//     createdAt: Date;

//     @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//     updatedAt: Date;

//     @Column({ type: 'timestamp', nullable: true })
//     deleteAt: Date | null;
// }