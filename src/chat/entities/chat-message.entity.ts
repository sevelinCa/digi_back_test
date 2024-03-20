import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { ChatRoom } from './chat-room.entity';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'senderId' })
  senderId: UserEntity;

  @ManyToOne(() => ChatRoom)
  @JoinColumn({ name: 'ChatRoomId' })
  chatRoomId: ChatRoom;

  @Column()
  messageBody: string;
  
  @Column({ default: false })
  read: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleteAt: Date | null;
}
