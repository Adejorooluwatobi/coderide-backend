import { Inject, Injectable, Logger, NotFoundException, ForbiddenException, forwardRef } from '@nestjs/common';
import { Chat } from '../entities/chat.entity';
import { ChatMessage } from '../entities/chat-message.entity';
import type { IChatRepository } from '../repositories/chat.repository.interface';
import { ChatType } from '../enums/chat.enum';
import { ChatMessageType } from '../enums/chat-message-type.enum';
import { CreateChatParams, CreateChatMessageParams, SendMessageParams } from 'src/utils/type';
import { NotificationService } from './notification.service';
import { NotificationType } from '../enums/notification.enum';
import { LiveKitService } from 'src/infrastructure/messaging/livekit.service';
import { AppGateway } from 'src/shared/websockets/app.gateway';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @Inject('IChatRepository')
    private readonly chatRepository: IChatRepository,
    private readonly notificationService: NotificationService,
    private readonly liveKitService: LiveKitService,
    @Inject(forwardRef(() => AppGateway))
    private readonly appGateway: AppGateway,
  ) {}

  async findById(id: string): Promise<Chat | null> {
    return this.chatRepository.findById(id);
  }

  async findByRiderId(riderId: string): Promise<Chat[]> {
    return this.chatRepository.findByRiderId(riderId);
  }

  async findByDriverId(driverId: string): Promise<Chat[]> {
    return this.chatRepository.findByDriverId(driverId);
  }

  async create(params: CreateChatParams): Promise<Chat> {
    return this.chatRepository.create(params);
  }

  async getOrCreateChatForRide(rideId: string, riderId: string, driverId: string): Promise<Chat> {
    let chat = await this.chatRepository.findByRideId(rideId);
    if (!chat) {
      chat = await this.chatRepository.create({
        rideId,
        riderId,
        driverId,
        type: ChatType.RIDE,
      } as CreateChatParams);
    }
    return chat;
  }

  async sendMessage(chatId: string, params: SendMessageParams): Promise<ChatMessage> {
    const chat = await this.findById(chatId);
    if (!chat) {
      throw new NotFoundException(`Chat ${chatId} not found`);
    }

    const messageParams: CreateChatMessageParams = {
      chatId,
      message: params.message,
      type: params.type || ChatMessageType.TEXT,
      attachmentUrl: params.attachmentUrl,
      mimeType: params.mimeType,
      fileSize: params.fileSize,
      duration: params.duration,
      senderUserId: params.senderUserId,
      senderAdminId: params.senderAdminId,
      senderId: params.senderId,
    };

    const chatMessage = await this.chatRepository.addMessage(chatId, messageParams);

    // Identify recipient
    const recipientId = chat.riderId === params.senderId ? chat.driverId : chat.riderId;

    // Real-time Delivery
    if (recipientId) {
      const delivered = this.appGateway.sendToUser(recipientId, 'new-message', chatMessage);
      if (!delivered) {
        // Send Push/Database Notification if user is offline
        await this.notificationService.create({
          userId: recipientId,
          title: 'New Message',
          message: params.message || 'You have a new attachment',
          type: NotificationType.CHAT_MESSAGE,
        });
      }
    }

    // Always notify admins for monitoring
    this.appGateway.broadcastToAdmins('admin-log-message', {
      chatId,
      message: chatMessage,
    });

    return chatMessage;
  }

  /**
   * Generates a LiveKit RTC token and handles calling logic.
   */
  async getCallToken(chatId: string, userId: string, name: string, isAdmin: boolean = false): Promise<{ token: string; roomName: string }> {
    const chat = await this.findById(chatId);
    if (!chat) throw new NotFoundException('Chat not found');

    const roomName = `chat_${chatId}`;
    let token: string;

    if (isAdmin) {
      token = await this.liveKitService.generateAdminJoinToken(roomName, userId, name);
      this.logger.log(`Admin ${userId} joining call in chat ${chatId}`);
    } else {
      // Check busy status for the other party if this is a new call
      const recipientId = chat.riderId === userId ? chat.driverId : chat.riderId;
      if (recipientId && this.appGateway.isUserBusy(recipientId)) {
        throw new ForbiddenException('User is already on another call');
      }

      token = await this.liveKitService.generateToken(roomName, userId, name);
    }

    return { token, roomName };
  }

  /**
   * Log a call event in the chat history.
   */
  async logCallEvent(chatId: string, type: ChatMessageType, senderId: string, duration?: number): Promise<ChatMessage> {
    const message = type === ChatMessageType.CALL_START ? 'Call started' : 
                    type === ChatMessageType.CALL_END ? 'Call ended' : 'Missed call';
    
    return this.sendMessage(chatId, {
      chatId,
      message,
      type,
      duration,
      senderId,
      senderUserId: senderId,
    });
  }

  async getMessages(chatId: string): Promise<ChatMessage[]> {
    return this.chatRepository.getMessages(chatId);
  }

  async markAsRead(chatId: string, userId: string, isAdmin: boolean = false): Promise<void> {
    if (isAdmin) {
      await this.chatRepository.markMessagesAsRead(chatId, undefined, userId);
    } else {
      await this.chatRepository.markMessagesAsRead(chatId, userId, undefined);
    }
  }
}
