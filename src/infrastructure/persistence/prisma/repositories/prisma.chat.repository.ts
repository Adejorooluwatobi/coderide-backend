import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IChatRepository } from 'src/domain/repositories/chat.repository.interface';
import { Chat } from 'src/domain/entities/chat.entity';
import { ChatMessage } from 'src/domain/entities/chat-message.entity';
import { ChatMapper } from 'src/infrastructure/mappers/chat.mapper';
import { CreateChatParams, CreateChatMessageParams } from 'src/utils/type';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaChatRepository implements IChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Chat | null> {
    const chat = await this.prisma.chat.findUnique({
      where: { id },
      include: { messages: true, ride: true, rider: true, driver: true, admin: true },
    });
    return chat ? ChatMapper.toDomain(chat) : null;
  }

  async findByRideId(rideId: string): Promise<Chat | null> {
    const chat = await this.prisma.chat.findUnique({
      where: { rideId },
      include: { messages: true },
    });
    return chat ? ChatMapper.toDomain(chat) : null;
  }

  async findByParticipants(riderId?: string, driverId?: string, adminId?: string): Promise<Chat | null> {
    const chat = await this.prisma.chat.findFirst({
      where: {
        riderId: riderId || null,
        driverId: driverId || null,
        adminId: adminId || null,
      },
      include: { messages: true },
    });
    return chat ? ChatMapper.toDomain(chat) : null;
  }

  async create(params: CreateChatParams): Promise<Chat> {
    const chat = await this.prisma.chat.create({
      data: {
        rideId: params.rideId,
        riderId: params.riderId,
        driverId: params.driverId,
        adminId: params.adminId,
        type: params.type,
      },
    });
    return ChatMapper.toDomain(chat);
  }

  async addMessage(chatId: string, params: CreateChatMessageParams): Promise<ChatMessage> {
    if (!params.message) {
      throw new Error('Message content is required');
    }

    const chatMessage = await this.prisma.chatMessage.create({
      data: {
        chatId,
        senderUserId: params.senderUserId,
        senderAdminId: params.senderAdminId,
        message: params.message,
        isRead: false,
      },
    });
    return ChatMapper.toMessageDomain(chatMessage);
  }

  async getMessages(chatId: string): Promise<ChatMessage[]> {
    const messages = await this.prisma.chatMessage.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
    });
    return messages.map((m) => ChatMapper.toMessageDomain(m));
  }

  async markMessagesAsRead(chatId: string, userId?: string, adminId?: string): Promise<void> {
    await this.prisma.chatMessage.updateMany({
      where: {
        chatId,
        isRead: false,
        NOT: {
          senderUserId: userId,
          senderAdminId: adminId,
        },
      },
      data: { isRead: true },
    });
  }
}
