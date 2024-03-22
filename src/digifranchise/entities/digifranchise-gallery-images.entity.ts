import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { DigifranchiseOwnedProduct } from "./digifranchise-owned-product.entity";
import { DigifranchiseOwnedServiceOffered } from "./digifranchise-owned-service-offered.entity";

@Entity()
export class DigifranchiseGalleryImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  imageUrl: string;

  @ManyToOne(() => DigifranchiseOwnedServiceOffered, service => service.galleryImages, { nullable: true })
  service: DigifranchiseOwnedServiceOffered | null;

  @ManyToOne(() => DigifranchiseOwnedProduct, product => product.galleryImages, { nullable: true })
  product: DigifranchiseOwnedProduct | null;
  
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleteAt: Date | null;
}
