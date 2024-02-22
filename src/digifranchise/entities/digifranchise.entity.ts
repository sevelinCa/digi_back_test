import { StatusEnum } from 'src/statuses/statuses.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ServiceOffered } from '../dto/create-digifranchise.dto';

@Entity()
export class Digifranchise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @Column({ type: 'varchar', length: 255 })
  userFullNames: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  franchiseName: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  Description: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  ServicesOffered: ServiceOffered[];

  @Column({ type: 'varchar', length: 255, default: 'active' })
  status: StatusEnum;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleteAt: Date | null;
}
