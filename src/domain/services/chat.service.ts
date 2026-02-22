import { Inject, Injectable, Logger } from '@nestjs/common';
import { Chat } from '../entities/chat.entity';
import { ChatMessage } from '../entities/chat-message.entity';
import type { IChatRepository } from '../repositories/chat.repository.interface';
import { ChatType } from '../enums/chat.enum';
import { CreateChatParams, CreateChatMessageParams, SendMessageParams } from 'src/utils/type';
import { NotificationService } from './notification.service';
import { NotificationType } from '../enums/notification.enum';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @Inject('IChatRepository')
    private readonly chatRepository: IChatRepository,
    private readonly notificationService: NotificationService,
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
    this.logger.log(`Creating chat with data: ${JSON.stringify(params)}`);
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

  async getOrCreateDirectChat(riderId: string, driverId: string): Promise<Chat> {
    let chat = await this.chatRepository.findByParticipants(riderId, driverId);
    if (!chat) {
        chat = await this.chatRepository.create({
            riderId,
            driverId,
            type: ChatType.RIDE, // Persistent chat between rider and driver
        } as CreateChatParams);
    }
    return chat;
  }

  async sendMessage(chatId: string, params: SendMessageParams): Promise<ChatMessage> {
    this.logger.log(`Sending message to chat ${chatId}`);
    
    const messageParams: CreateChatMessageParams = {
      chatId,
      message: params.message,
      senderUserId: params.senderUserId,
      senderAdminId: params.senderAdminId,
      senderId: params.senderId,
    };

    const chatMessage = await this.chatRepository.addMessage(chatId, messageParams);

    // Notification Logic
    const chat = await this.findById(chatId);
    if (chat) {
        // Notify recipient based on who sent the message
        const isFromAdmin = !!params.senderAdminId;
        
        if (isFromAdmin) {
            // Send from Admin to Rider or Driver
            if (chat.rider?.userId) {
                await this.notificationService.create({
                    userId: chat.rider.userId,
                    title: 'Support Message',
                    message: `Admin: ${params.message}`,
                    type: NotificationType.CHAT_MESSAGE,
                });
            } else if (chat.driver?.userId) {
                await this.notificationService.create({
                    userId: chat.driver.userId,
                    title: 'Support Message',
                    message: `Admin: ${params.message}`,
                    type: NotificationType.CHAT_MESSAGE,
                });
            }
        } else {
            // Send from User to other User
            const senderUserId = params.senderUserId;
            let recipientUserId: string | undefined;

            if (chat.rider?.userId === senderUserId) {
                recipientUserId = chat.driver?.userId;
            } else if (chat.driver?.userId === senderUserId) {
                recipientUserId = chat.rider?.userId;
            }

            if (recipientUserId) {
                await this.notificationService.create({
                    userId: recipientUserId,
                    title: 'New Message',
                    message: params.message,
                    type: NotificationType.CHAT_MESSAGE,
                });
            }

            // Always notify Admins for monitoring
            // (In a real app, maybe only for Support chats or a general admin log)
        }
    }

    return chatMessage;
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
