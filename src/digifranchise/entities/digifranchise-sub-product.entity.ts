import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { DigifranchiseProduct } from './digifranchise-product.entity';

@Entity()
export class DigifranchiseSubProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DigifranchiseProduct)
  @JoinColumn({ name: 'digifranchiseProductId' })
  digifranchiseProductId: DigifranchiseProduct;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'userId' })
  userId: UserEntity | null;

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
