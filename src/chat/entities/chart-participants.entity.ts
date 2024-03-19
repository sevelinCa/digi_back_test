// import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
// import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, Column } from "typeorm";
// import { ChatSession } from "./chat-session.entity";


// @Entity()
// export class ChatParticipant {
//  @PrimaryGeneratedColumn('uuid')
//  id: string;

//  @ManyToOne(() => UserEntity)
//  user: UserEntity;

//  @ManyToOne(() => ChatSession)
//  chatSession: ChatSession;

//  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//  createdAt: Date;

//  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
//  updatedAt: Date;

//  @Column({ type: 'timestamp', nullable: true })
//  deleteAt: Date | null;
// }