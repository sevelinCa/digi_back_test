import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { AvailableManagement } from './available-management.entity';


export class UnavailableTime {
  date: Date;
  startTime: string;
  endTime: string;
}

@Entity()
export class UnavailableManagement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  userId: UserEntity;

  @ManyToOne(() => Digifranchise)
  @JoinColumn({ name: 'digifranchiseId' })
  digifranchiseId: Digifranchise;

  @ManyToOne(() => AvailableManagement)
  @JoinColumn({ name: 'AvailableManagementId' })
  AvailableManagementId: AvailableManagement;

  @Column({ type: 'json' })
  unavailableTime: UnavailableTime[];

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleteAt: Date | null;
}
