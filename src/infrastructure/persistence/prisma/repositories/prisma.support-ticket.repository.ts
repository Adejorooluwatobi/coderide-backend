import { Injectable } from '@nestjs/common';
import { ISupportTicketRepository } from '../../../../domain/repositories/support-ticket.repository.interface';
import { SupportTicket } from '../../../../domain/entities/support-ticket.entity';
import { CreateSupportTicketParams, UpdateSupportTicketParams } from '../../../../utils/type';
import { PrismaService } from '../prisma.service';
import { SupportTicketMapper } from '../../../mappers/support-ticket.mapper';
import { Prisma, TicketStatus } from '@prisma/client';

@Injectable()
export class PrismaSupportTicketRepository implements ISupportTicketRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<SupportTicket | null> {
    const ticket = await this.prisma.supportTicket.findUnique({ where: { id } });
    return ticket ? SupportTicketMapper.toDomain(ticket) : null;
  }

  async findAll(): Promise<SupportTicket[]> {
    const tickets = await this.prisma.supportTicket.findMany();
    return tickets.map(SupportTicketMapper.toDomain);
  }

  async findByUserId(userId: string): Promise<SupportTicket[]> {
    const tickets = await this.prisma.supportTicket.findMany({ where: { userId } });
    return tickets.map(SupportTicketMapper.toDomain);
  }

  async findByStatus(status: string): Promise<SupportTicket[]> {
    const tickets = await this.prisma.supportTicket.findMany({ where: { status: status as TicketStatus } });
    return tickets.map(SupportTicketMapper.toDomain);
  }

  async create(params: CreateSupportTicketParams): Promise<SupportTicket> {
    const ticket = await this.prisma.supportTicket.create({ data: params as Prisma.SupportTicketUncheckedCreateInput });
    return SupportTicketMapper.toDomain(ticket);
  }

  async update(id: string, params: Partial<UpdateSupportTicketParams>): Promise<SupportTicket> {
    const ticket = await this.prisma.supportTicket.update({ where: { id }, data: params as Prisma.SupportTicketUpdateInput });
    return SupportTicketMapper.toDomain(ticket);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.supportTicket.delete({ where: { id } });
  }
}
