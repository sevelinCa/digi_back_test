// import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from 'typeorm';
// import { DigifranchiseGalleryImage } from './digifranchise-gallery-images.entity';
// import { DigifranchiseOwner } from './digifranchise-ownership.entity';
// import { DigifranchiseSubProduct } from './digifranchise-sub-product.entity';

// @Entity()
// export class DigifranchiseOwnedProduct {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @ManyToOne(() => DigifranchiseOwner)
//   @JoinColumn({ name: 'ownedDigifranchiseId' })
//   ownedDigifranchiseId: DigifranchiseOwner;

//   @OneToMany(() => DigifranchiseSubProduct, subProduct => subProduct.digifranchiseProductId, { nullable: true })
//   subProducts: DigifranchiseSubProduct[];

//   @Column({ type: 'text' })
//   productName: string;

//   @Column({ type: 'text' })
//   description: string;

//   @Column({ type: 'varchar', length: 255 })
//   unitPrice: string;

//   @Column({ type: 'boolean', default: false })
//   isSelected: boolean;

//   @OneToMany(() => DigifranchiseGalleryImage, image => image.digifranchiseProductId)
//   galleryImages: DigifranchiseGalleryImage[];

//   @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   createdAt: Date;

//   @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//   updatedAt: Date;

//   @Column({ type: 'timestamp', nullable: true })
//   deleteAt: Date | null;
// }
