import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { DigifranchiseProduct } from './digifranchise-product.entity';
import { FranchiseOwnership } from './franchise-ownership.entity';
import { DigifranchiseService } from './digifranchise-service.entity';

@Entity()
export class Digifranchise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  digifranchiseName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, default: StatusEnum.inactive })
  status: StatusEnum;

  @OneToMany(() => DigifranchiseProduct, product => product.digifranchise)
  products: DigifranchiseProduct[];

  @OneToMany(() => DigifranchiseService, service => service.digifranchise)
  services: DigifranchiseService[];

  @OneToMany(() => FranchiseOwnership, ownership => ownership.digifranchise)
  franchiseOwnerships: FranchiseOwnership[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleteAt: Date | null;
}
