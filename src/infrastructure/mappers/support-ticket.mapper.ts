import { SupportTicket as PrismaSupportTicket } from '@prisma/client';
import { SupportTicket } from '../../domain/entities/support-ticket.entity';
import { TicketCategory } from 'src/domain/enums/ticket-category.enum';
import { TicketStatus } from 'src/domain/enums/ticket-status.enum';
import { Priority } from 'src/domain/enums/priority.enum';

export class SupportTicketMapper {
  static toDomain(prismaTicket: PrismaSupportTicket): SupportTicket {
    return new SupportTicket({
      id: prismaTicket.id,
      userId: prismaTicket.userId,
      rideId: prismaTicket.rideId ?? undefined,
      category: prismaTicket.category as TicketCategory,
      subject: prismaTicket.subject,
      description: prismaTicket.description,
      status: prismaTicket.status as TicketStatus,
      priority: prismaTicket.priority as Priority,
      adminId: prismaTicket.adminId ?? undefined,
      resolvedAt: prismaTicket.resolvedAt ?? undefined,
      createdAt: prismaTicket.createdAt,
      updatedAt: prismaTicket.updatedAt,
    });
  }

  static toPrisma(ticket: SupportTicket): Omit<PrismaSupportTicket, 'createdAt' | 'updatedAt'> {
    return {
      id: ticket.id,
      userId: ticket.userId,
      rideId: ticket.rideId ?? null,
      category: ticket.category,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      adminId: ticket.adminId ?? null,
      resolvedAt: ticket.resolvedAt ?? null,
    };
  }
}
