import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { DigifranchiseGeneralInfo } from './digifranchise-general-information.entity';
import { DigifranchiseComplianceInfo } from './digifranchise-compliance-information.entity';
import { DigifranchiseGalleryImage } from './digifranchise-gallery-images.entity';
import { DigifranchiseExpense } from './digifranchise-expense.entity';

@Entity()
export class DigifranchiseOwner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  digifranchiseId: string

  @ManyToOne(() => Digifranchise)
  @JoinColumn({ name: 'digifranchise' })
  digifranchise: Digifranchise;

  @OneToOne(() => DigifranchiseGeneralInfo, digifranchiseInfo => digifranchiseInfo.digifranchiseOwner)
  digifranchiseGeneralInfo: DigifranchiseGeneralInfo;

  @OneToOne(() => DigifranchiseComplianceInfo, digifranchiseInfo => digifranchiseInfo.digifranchiseOwner)
  digifranchiseComplianceInfo: DigifranchiseComplianceInfo;

  @OneToMany(() => DigifranchiseGalleryImage, image => image.digifranchiseOwnedId)
  digifranchiseGalleryImage: DigifranchiseGalleryImage[];


  @OneToMany(() => DigifranchiseExpense, ownedFranchise => ownedFranchise.ownedDigifranchise)
  digifranchiseExpense: DigifranchiseExpense[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleteAt: Date | null;
}
