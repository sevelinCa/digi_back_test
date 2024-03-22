import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { DigifranchiseGalleryImage } from './digifranchise-gallery-images.entity';
import { DigifranchiseOwner } from './digifranchise-ownership.entity';

@Entity()
export class DigifranchiseOwnedProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => DigifranchiseOwner)
  @JoinColumn({ name: 'ownedDigifranchiseId' })
  ownedDigifranchiseId: DigifranchiseOwner;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'userId' })
  userId: UserEntity | null;

  @Column({ type: 'text' })
  productName: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  unitPrice: string;

  @Column({ type: 'boolean', default: false })
  isSelected: boolean;

  @OneToMany(() => DigifranchiseGalleryImage, image => image.product)
  galleryImages: DigifranchiseGalleryImage[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleteAt: Date | null;
}
