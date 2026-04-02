import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { ChatService } from '../../domain/services/chat.service';
import { RiderService } from '../../domain/services/rider.service';
import { DriverService } from '../../domain/services/driver.service';
import { ApiOperation, ApiResponse, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { Chat } from 'src/domain/entities/chat.entity';
import { ChatMessage } from 'src/domain/entities/chat-message.entity';
import { UserGuard } from 'src/api/auth/guards/user.guard';
import { FileInterceptor } from '@nest-lab/fastify-multer';
import type { File } from 'fastify-multer/lib/interfaces';
import { CloudinaryService } from 'src/infrastructure/external-services/cloudinary.service';
import { ChatMessageType } from 'src/domain/enums/chat-message-type.enum';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(UserGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly riderService: RiderService,
    private readonly driverService: DriverService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('my-chats')
  @ApiOperation({ summary: 'Get all chats for the current user' })
  @ApiResponse({ status: 200, type: [Chat] })
  async getMyChats(@Request() req: any) {
    const userId = req.user.sub;
    const userRole = req.user.role;

    if (userRole === 'RIDER') {
      const rider = await this.riderService.findByUserId(userId);
      if (!rider) return [];
      return this.chatService.findByRiderId(rider.id);
    } else if (userRole === 'DRIVER') {
      const driver = await this.driverService.findByUserId(userId);
      if (!driver) return [];
      return this.chatService.findByDriverId(driver.id);
    }
    return [];
  }

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
  @ApiOperation({ summary: 'Send a message (supports text and/or file)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 201, type: ChatMessage })
  async sendMessage(
    @Param('id') id: string,
    @Body('message') message?: string,
    @Body('type') type?: ChatMessageType,
    @UploadedFile() file?: any, // Using any due to emitDecoratorMetadata issues with File interface
    @Request() req?: any,
  ) {
    const userId = req.user.sub;
    const isAdmin = req.user.role === 'ADMIN';
    const uploadFile = file as File; // Cast to fastify file
    
    let attachmentUrl: string | undefined;
    let mimeType: string | undefined;
    let fileSize: number | undefined;

    if (uploadFile) {
      const uploadResult = await this.cloudinaryService.uploadFile(uploadFile);
      attachmentUrl = uploadResult.secure_url;
      mimeType = uploadFile.mimetype;
      fileSize = uploadFile.size;
    }

    return this.chatService.sendMessage(id, {
      chatId: id,
      message,
      type: type || (uploadFile ? this.mapMimeToType(uploadFile.mimetype) : ChatMessageType.TEXT),
      attachmentUrl,
      mimeType,
      fileSize,
      senderUserId: isAdmin ? undefined : userId,
      senderAdminId: isAdmin ? userId : undefined,
      senderId: userId,
    });
  }

  @Get(':id/rtc-token')
  @ApiOperation({ summary: 'Generate RTC token for a call' })
  async getRtcToken(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const userId = req.user.sub;
    const name = req.user.name || userId;
    const isAdmin = req.user.role === 'ADMIN';

    return this.chatService.getCallToken(id, userId, name, isAdmin);
  }

  @Post(':id/call-log')
  @ApiOperation({ summary: 'Log a call event (start, end, missed)' })
  async logCall(
    @Param('id') id: string,
    @Body('type') type: ChatMessageType,
    @Body('duration') duration?: number,
    @Request() req?: any,
  ) {
    const userId = req.user.sub;
    return this.chatService.logCallEvent(id, type, userId, duration);
  }

  private mapMimeToType(mimetype: string): ChatMessageType {
    if (mimetype.startsWith('image/')) return ChatMessageType.IMAGE;
    if (mimetype.startsWith('audio/')) return ChatMessageType.VOICE_NOTE;
    return ChatMessageType.FILE;
  }
}
