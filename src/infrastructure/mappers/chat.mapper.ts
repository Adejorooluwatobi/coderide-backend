import { Chat as PrismaChat, ChatMessage as PrismaChatMessage } from '@prisma/client';
import { Chat } from '../../domain/entities/chat.entity';
import { ChatMessage } from '../../domain/entities/chat-message.entity';
import { ChatType } from 'src/domain/enums/chat.enum';

export class ChatMapper {
  static toDomain(prismaChat: any): Chat {
    return new Chat({
      id: prismaChat.id,
      rideId: prismaChat.rideId ?? undefined,
      riderId: prismaChat.riderId ?? undefined,
      driverId: prismaChat.driverId ?? undefined,
      adminId: prismaChat.adminId ?? undefined,
      type: prismaChat.type as ChatType,
      createdAt: prismaChat.createdAt,
      updatedAt: prismaChat.updatedAt,
      // Relations can be mapped here if included in prisma object
      messages: prismaChat.messages?.map((m: any) => ChatMapper.toMessageDomain(m)) || [],
    });
  }

  static toPrisma(chat: Chat): Omit<PrismaChat, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      rideId: chat.rideId ?? null,
      riderId: chat.riderId ?? null,
      driverId: chat.driverId ?? null,
      adminId: chat.adminId ?? null,
      type: chat.type,
    };
  }

  static toMessageDomain(prismaMessage: any): ChatMessage {
    return new ChatMessage({
      id: prismaMessage.id,
      chatId: prismaMessage.chatId,
      senderUserId: prismaMessage.senderUserId ?? undefined,
      senderAdminId: prismaMessage.senderAdminId ?? undefined,
      message: prismaMessage.message,
      isRead: prismaMessage.isRead,
      createdAt: prismaMessage.createdAt,
    });
  }

  static toMessagePrisma(message: ChatMessage): Omit<PrismaChatMessage, 'id' | 'createdAt'> {
    return {
      chatId: message.chatId,
      senderUserId: message.senderUserId ?? null,
      senderAdminId: message.senderAdminId ?? null,
      message: message.message,
      isRead: message.isRead,
    };
  }
}
