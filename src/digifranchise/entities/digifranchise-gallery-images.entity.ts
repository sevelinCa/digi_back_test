import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { DigifranchiseNewProduct } from "./digifranchise-new-product.entity";
import { DigifranchiseNewServiceOffered } from "./digifranchise-new-service-offered.entity";

@Entity()
export class DigifranchiseGalleryImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  imageUrl: string;

  @ManyToOne(() => DigifranchiseNewServiceOffered, service => service.galleryImages, { nullable: true })
  service: DigifranchiseNewServiceOffered | null;

  @ManyToOne(() => DigifranchiseNewProduct, product => product.galleryImages, { nullable: true })
  product: DigifranchiseNewProduct | null;
  
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleteAt: Date | null;
}
