import { TicketMessage as PrismaTicketMessage } from '@prisma/client';
import { TicketMessage } from '../../domain/entities/ticket-message.entity';

export class TicketMessageMapper {
  static toDomain(prismaMessage: PrismaTicketMessage): TicketMessage {
    return new TicketMessage({
      id: prismaMessage.id,
      ticketId: prismaMessage.ticketId,
      senderId: prismaMessage.senderId,
      message: prismaMessage.message,
      isAdminReply: prismaMessage.isAdminReply,
      attachments: prismaMessage.attachments,
      createdAt: prismaMessage.createdAt,
      updatedAt: prismaMessage.updatedAt,
    });
  }

  static toPrisma(message: TicketMessage): Omit<PrismaTicketMessage, 'createdAt' | 'updatedAt'> {
    return {
      id: message.id,
      ticketId: message.ticketId,
      senderId: message.senderId,
      message: message.message,
      isAdminReply: message.isAdminReply,
      attachments: message.attachments ?? [],
    };
  }
}
