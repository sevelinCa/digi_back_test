import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinTable,
    ManyToMany,
} from 'typeorm';

@Entity()
export class ChatRoom {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToMany(() => UserEntity)
    @JoinTable()
    participants: UserEntity[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deleteAt: Date | null;
}
