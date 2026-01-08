import { Inject, Injectable, Logger } from '@nestjs/common';
import { Chat } from '../entities/chat.entity';
import { ChatMessage } from '../entities/chat-message.entity';
import type { IChatRepository } from '../repositories/chat.repository.interface';
import { ChatType } from '../enums/chat.enum';
import { CreateChatParams, CreateChatMessageParams, SendMessageParams } from 'src/utils/type';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @Inject('IChatRepository')
    private readonly chatRepository: IChatRepository,
  ) {}

  async findById(id: string): Promise<Chat | null> {
    return this.chatRepository.findById(id);
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

    return this.chatRepository.addMessage(chatId, messageParams);
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
