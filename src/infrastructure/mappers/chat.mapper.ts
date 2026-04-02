import { Chat as PrismaChat, ChatMessage as PrismaChatMessage } from '@prisma/client';
import { Chat } from '../../domain/entities/chat.entity';
import { ChatMessage } from '../../domain/entities/chat-message.entity';
import { ChatType } from 'src/domain/enums/chat.enum';
import { ChatMessageType } from 'src/domain/enums/chat-message-type.enum';

export class ChatMapper {
  static toDomain(prismaChat: any): Chat {
    return new Chat({
      id: prismaChat.id,
      rideId: prismaChat.rideId ?? undefined,
      riderId: prismaChat.riderId ?? undefined,
      driverId: prismaChat.driverId ?? undefined,
      adminId: prismaChat.adminId ?? undefined,
      type: prismaChat.type as ChatType,
      activeCallId: prismaChat.activeCallId,
      activeCallStartedAt: prismaChat.activeCallStartedAt,
      lastMessageAt: prismaChat.lastMessageAt,
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
      activeCallId: chat.activeCallId ?? null,
      activeCallStartedAt: chat.activeCallStartedAt ?? null,
      lastMessageAt: chat.lastMessageAt ?? null,
    };
  }

  static toMessageDomain(prismaMessage: any): ChatMessage {
    return new ChatMessage({
      id: prismaMessage.id,
      chatId: prismaMessage.chatId,
      senderUserId: prismaMessage.senderUserId ?? undefined,
      senderAdminId: prismaMessage.senderAdminId ?? undefined,
      message: prismaMessage.message ?? undefined,
      type: prismaMessage.type as ChatMessageType,
      attachmentUrl: prismaMessage.attachmentUrl ?? undefined,
      mimeType: prismaMessage.mimeType ?? undefined,
      fileSize: prismaMessage.fileSize ?? undefined,
      duration: prismaMessage.duration ?? undefined,
      isRead: prismaMessage.isRead,
      isDelivered: prismaMessage.isDelivered,
      readAt: prismaMessage.readAt ?? undefined,
      deliveredAt: prismaMessage.deliveredAt ?? undefined,
      createdAt: prismaMessage.createdAt,
    });
  }

  static toMessagePrisma(message: ChatMessage): Omit<PrismaChatMessage, 'id' | 'createdAt'> {
    return {
      chatId: message.chatId,
      senderUserId: message.senderUserId ?? null,
      senderAdminId: message.senderAdminId ?? null,
      message: message.message ?? null,
      type: message.type,
      attachmentUrl: message.attachmentUrl ?? null,
      mimeType: message.mimeType ?? null,
      fileSize: message.fileSize ?? null,
      duration: message.duration ?? null,
      isRead: message.isRead,
      isDelivered: message.isDelivered,
      readAt: message.readAt ?? null,
      deliveredAt: message.deliveredAt ?? null,
    };
  }
}
