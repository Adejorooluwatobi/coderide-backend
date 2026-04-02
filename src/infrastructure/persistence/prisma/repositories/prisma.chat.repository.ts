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

  async findByRiderId(riderId: string): Promise<Chat[]> {
    const chats = await this.prisma.chat.findMany({
      where: { riderId },
      include: { messages: true, rider: true, driver: true, admin: true },
    });
    return chats.map((c) => ChatMapper.toDomain(c));
  }

  async findByDriverId(driverId: string): Promise<Chat[]> {
    const chats = await this.prisma.chat.findMany({
      where: { driverId },
      include: { messages: true, rider: true, driver: true, admin: true },
    });
    return chats.map((c) => ChatMapper.toDomain(c));
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
    const chatMessage = await this.prisma.chatMessage.create({
      data: {
        chatId,
        senderUserId: params.senderUserId || null,
        senderAdminId: params.senderAdminId || null,
        message: params.message || null,
        type: params.type || 'TEXT',
        attachmentUrl: params.attachmentUrl || null,
        mimeType: params.mimeType || null,
        fileSize: params.fileSize || null,
        duration: params.duration || null,
        isRead: false,
        isDelivered: false,
      },
    });

    // Update lastMessageAt in Chat
    await this.prisma.chat.update({
      where: { id: chatId },
      data: { lastMessageAt: new Date() },
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
