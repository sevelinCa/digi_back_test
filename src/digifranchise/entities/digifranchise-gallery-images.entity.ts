import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import { DigifranchiseServiceOffered } from "./digifranchise-service-offered.entity";
import { DigifranchiseProduct } from "./digifranchise-product.entity";

@Entity()
export class DigifranchiseGalleryImage {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column({ type: 'text' })
 imageUrl: string;

 @ManyToOne(() => DigifranchiseServiceOffered, service => service.serviceGalleryImages, { nullable: true })
 @JoinColumn({ name: 'digifranchiseServiceId' }) 
 digifranchiseServiceId: DigifranchiseServiceOffered | null;

 @ManyToOne(() => DigifranchiseProduct, product => product.productGalleryImages, { nullable: true })
 @JoinColumn({ name: 'digifranchiseProductId' }) 
 digifranchiseProductId: DigifranchiseProduct | null;
  
 @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
 createdAt: Date;

 @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
 updatedAt: Date;

 @Column({ type: 'timestamp', nullable: true })
 deleteAt: Date | null;
}

