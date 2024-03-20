import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { ChatMessage } from './entities/chat-message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatMessage,
      UserEntity,
    ]),
  ],
  providers: [ChatService],
  controllers: [ChatController]
})
export class ChatModule {}

