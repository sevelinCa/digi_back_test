// import { DigifranchiseOwner } from "src/digifranchise/entities/digifranchise-ownership.entity";
// import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

// @Entity()
// export class DigifranchiseUnavailableTimes {
//     @PrimaryGeneratedColumn('uuid')
//     id: string;

//     @ManyToOne(() => DigifranchiseOwner, ownedFranchise => ownedFranchise.availability)
//     @JoinColumn({ name: 'ownedDigifranchise' })
//     ownedDigifranchise: DigifranchiseOwner | null;

//     @Column({ type: 'timestamp', nullable: true })
//     workingDate?: Date;

//     @Column({ type: 'time' })
//     startTime: string;

//     @Column({ type: 'time' })
//     endTime: string;

//     @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//     createdAt: Date;

//     @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//     updatedAt: Date;

//     @Column({ type: 'timestamp', nullable: true })
//     deleteAt: Date | null;
// }