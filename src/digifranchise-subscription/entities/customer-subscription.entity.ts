import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';

@Entity()
export class CustomerSubscription {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @ManyToOne(() => UserEntity)
 @JoinColumn({ name: 'userId' })
 userId: UserEntity;

 @ManyToOne(() => Digifranchise)
 @JoinColumn({ name: 'digifranchiseId' })
 digifranchiseId: Digifranchise;

 @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
 createdAt: Date;

 @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
 updatedAt: Date;

 @Column({ type: 'timestamp', nullable: true })
 deleteAt: Date | null;
}