import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from 'typeorm';
import { Digifranchise } from './digifranchise.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { DigifranchiseGalleryImage } from './digifranchise-gallery-images.entity';

@Entity()
export class DigifranchiseProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Digifranchise)
  @JoinColumn({ name: 'digifranchiseId' })
  digifranchiseId: Digifranchise;

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'userId' })
  userId: UserEntity | null;

  @OneToMany(() => DigifranchiseGalleryImage, image => image.digifranchiseProductId)
  productGalleryImages: DigifranchiseGalleryImage[];

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
