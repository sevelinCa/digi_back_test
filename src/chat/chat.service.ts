import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatRoom } from './entities/chat-room.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { SendChatMessageDto } from './dto/chat-message.dto';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatMessage)
        private chatMessageRepository: Repository<ChatMessage>,
        @InjectRepository(ChatRoom)
        private chatRoomRepository: Repository<ChatRoom>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) { }

    async saveMessage(senderId: string, sendChatMessageDto: SendChatMessageDto): Promise<ChatMessage> {
        const sender = await this.userRepository.findOne({ where: { id: senderId } });
        if (!sender) {
            throw new NotFoundException('Sender not found');
        }

        const chatRoom = await this.chatRoomRepository.findOne({
            where: { participants: { id: senderId } },
            relations: ['participants']
        });

        let roomId;
        if (chatRoom) {
            roomId = chatRoom.id;
        } else {
            const newRoom = this.chatRoomRepository.create({
                participants: [sender],
            });
            const savedRoom = await this.chatRoomRepository.save(newRoom);
            roomId = savedRoom.id;
        }

        const message = this.chatMessageRepository.create({
            ...sendChatMessageDto,
            senderId: sender,
            chatRoomId: roomId,
        });
        const savedMessage = await this.chatMessageRepository.save(message);
        return savedMessage;
    }

    async getChatHistory(roomId: string): Promise<ChatMessage[]> {
        const room = await this.chatRoomRepository.findOne({ where: { id: roomId }, relations: ['participants'] });
        if (!room) {
            throw new NotFoundException('Room not found');
        }

        const messages = await this.chatMessageRepository.find({ where: { chatRoomId: room }, order: { createdAt: 'ASC' } });
        return messages;
    }

    async markMessageAsRead(messageId: string): Promise<void> {
        const message = await this.chatMessageRepository.findOne({ where: { id: messageId } });
        if (!message) {
            throw new NotFoundException(`Message with ID ${messageId} not found`);
        }

        message.read = true;
        await this.chatMessageRepository.save(message);
    }

}