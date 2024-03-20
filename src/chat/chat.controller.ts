import { Body, Controller, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RolesGuard } from 'src/roles/roles.guard';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { Request } from 'express';
import { ChatService } from './chat.service';
import { SendChatMessageDto } from './dto/chat-message.dto';
import { ChatMessage } from './entities/chat-message.entity';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'chat', version: '1' })
export class ChatController {
    constructor(private readonly chatService: ChatService) { }


    @ApiOperation({ summary: 'CREATE - send message', })
    @ApiResponse({ status: HttpStatus.OK, description: 'Message send successful.' })
    @ApiBody({ type: SendChatMessageDto })
    @Post('send-message')
    async createEvent(
        @Req() req: Request,
        @Body() sendChatMessageDto: SendChatMessageDto): Promise<ChatMessage> {
        const senderId = (req.user as UserEntity).id;

        return this.chatService.saveMessage(senderId, sendChatMessageDto);
    }
}
