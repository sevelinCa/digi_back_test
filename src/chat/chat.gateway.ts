import { WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChatRoom } from "./entities/chat-room.entity";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import { ChatService } from './chat.service';
import { findAdminID } from "src/helper/FindByFunctions";

export class ChatGateway {
    @WebSocketServer()
    server: Server;

    constructor(
        @InjectRepository(ChatRoom)
        private readonly chatRoomRepository: Repository<ChatRoom>,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private chatService: ChatService,
    ) { }

@SubscribeMessage('sendMessage')
async handleMessage(@MessageBody() data: { roomId: string; senderId: string, message: string }, @ConnectedSocket() client: Socket) {
    const sender = await this.userRepository.findOne({ where: { id: data.senderId } });
    if (!sender) {
        throw new Error('Sender not found');
    }

    let roomId = data.roomId;
    if (!roomId) {
        roomId = await this.createRoom(data.senderId);
    }

const message = await this.chatService.saveMessage(data.senderId, { messageBody: data.message });
client.join(roomId);
this.server.to(roomId).emit('message', { roomId, message: message.messageBody });
}

    @SubscribeMessage('markAsRead')
    async handleMarkAsRead(@MessageBody() data: { roomId: string; messageId: string }, @ConnectedSocket() client: Socket) {
        const message = await this.chatService.markMessageAsRead(data.messageId);
        this.server.to(data.roomId).emit('messageRead', { messageId: data.messageId });
    }

    private async createRoom(senderId: string): Promise<string> {
      const adminId = await findAdminID();
      if (!adminId) {
          throw new Error('Admin Id not found');
      }

      const sender = await this.userRepository.findOne({ where: { id: senderId } });
      if (!sender) {
          throw new Error('Sender not found');
      }

      const admin = await this.userRepository.findOne({ where: { id: adminId } });
      if (!admin) {
          throw new Error('Admin not found');
      }

      const newRoom = this.chatRoomRepository.create({
          participants: [sender, admin],
      });

      const savedRoom = await this.chatRoomRepository.save(newRoom);

      return savedRoom.id;
    }
}