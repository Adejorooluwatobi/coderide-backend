import { Injectable } from '@nestjs/common';
import { ITicketMessageRepository } from '../../../../domain/repositories/ticket-message.repository.interface';
import { TicketMessage } from '../../../../domain/entities/ticket-message.entity';
import { Prisma } from '@prisma/client';
import { CreateTicketMessageParams, UpdateTicketMessageParams } from '../../../../utils/type';
import { PrismaService } from '../prisma.service';
import { TicketMessageMapper } from '../../../mappers/ticket-message.mapper';

@Injectable()
export class PrismaTicketMessageRepository implements ITicketMessageRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<TicketMessage | null> {
    const message = await this.prisma.ticketMessage.findUnique({ where: { id } });
    return message ? TicketMessageMapper.toDomain(message) : null;
  }

  async findAll(): Promise<TicketMessage[]> {
    const messages = await this.prisma.ticketMessage.findMany();
    return messages.map(TicketMessageMapper.toDomain);
  }

  async findByTicketId(ticketId: string): Promise<TicketMessage[]> {
    const messages = await this.prisma.ticketMessage.findMany({ where: { ticketId } });
    return messages.map(TicketMessageMapper.toDomain);
  }

  async create(params: CreateTicketMessageParams): Promise<TicketMessage> {
    const message = await this.prisma.ticketMessage.create({ data: params as Prisma.TicketMessageUncheckedCreateInput });
    return TicketMessageMapper.toDomain(message);
  }

  async update(id: string, params: Partial<UpdateTicketMessageParams>): Promise<TicketMessage> {
    const message = await this.prisma.ticketMessage.update({ where: { id }, data: params as Prisma.TicketMessageUpdateInput });
    return TicketMessageMapper.toDomain(message);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.ticketMessage.delete({ where: { id } });
  }
}
