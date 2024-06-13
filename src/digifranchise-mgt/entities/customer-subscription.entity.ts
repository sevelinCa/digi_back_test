// import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
// import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';
// import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
// import { DigifranchiseOwner } from 'src/digifranchise/entities/digifranchise-ownership.entity';

// @Entity()
// export class CustomerSubscription {
//  @PrimaryGeneratedColumn('uuid')
//  id: string;

// @ManyToOne(() => UserEntity, { nullable: true, onDelete: 'CASCADE' })
// @JoinColumn({ name: "userId" })
// userId: UserEntity | null;

// //  @ManyToOne(() => Digifranchise, { nullable: true })
// //  @JoinColumn({ name: 'digifranchiseId' })
// //  digifranchiseId: Digifranchise | null;

//  @ManyToOne(() => DigifranchiseOwner,ownedFranchise  => ownedFranchise.subscription)
//  @JoinColumn({ name: 'ownedDigifranchise' })
//  ownedDigifranchise: DigifranchiseOwner | null;

//  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//  createdAt: Date;

//  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//  updatedAt: Date;

//  @Column({ type: 'timestamp', nullable: true })
//  deleteAt: Date | null;
// }
