import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { DigifranchiseOwner } from "./digifranchise-ownership.entity";
import { DigifranchiseServiceOffered } from "./digifranchise-service-offered.entity";

@Entity()
export class DigifranchiseSelectProductOrServiceTable {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => DigifranchiseOwner, { nullable: true })
    @JoinColumn({ name: 'ownerDigifranchiseId' })
    ownerDigifranchiseId: DigifranchiseOwner | null;

    @ManyToOne(() => DigifranchiseServiceOffered, { nullable: true })
    @JoinColumn({ name: 'digifranchiseServiceId' })
    digifranchiseServiceId: DigifranchiseServiceOffered | null;

    @ManyToOne(() => UserEntity, { nullable: true })
    @JoinColumn({ name: 'userId' })
    userId: UserEntity | null;

    @Column({ type: 'boolean', default: false })
    isSelected: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deleteAt: Date | null;
}