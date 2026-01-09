import { Body, Controller, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { ChatService } from '../../domain/services/chat.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Chat } from 'src/domain/entities/chat.entity';
import { ChatMessage } from 'src/domain/entities/chat-message.entity';
import { UserGuard } from 'src/api/auth/guards/user.guard';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(UserGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get chat by ID' })
  @ApiResponse({ status: 200, type: Chat })
  async getChat(@Param('id') id: string) {
    return this.chatService.findById(id);
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Get messages for a chat' })
  @ApiResponse({ status: 200, type: [ChatMessage] })
  async getMessages(@Param('id') id: string) {
    return this.chatService.getMessages(id);
  }

  @Post(':id/message')
  @ApiOperation({ summary: 'Send a message' })
  @ApiResponse({ status: 201, type: ChatMessage })
  async sendMessage(
    @Param('id') id: string,
    @Body('message') message: string,
    @Request() req: any,
  ) {
    const userId = req.user.sub;
    const isAdmin = req.user.role === 'ADMIN';
    return this.chatService.sendMessage(id, {
      chatId: id,
      message,
      senderUserId: isAdmin ? undefined : userId,
      senderAdminId: isAdmin ? userId : undefined,
      senderId: userId,
    });
  }
}
