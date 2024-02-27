import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { DigifranchiseProduct } from './digifranchise-product.entity';

@Entity()
export class DigifranchiseSubProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DigifranchiseProduct)
  @JoinColumn({ name: 'productId' })
  productId: DigifranchiseProduct;

  @Column({type: 'text'})
  productName: string;
  
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
