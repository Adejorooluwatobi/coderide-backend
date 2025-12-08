import { Inject, Injectable, Logger } from '@nestjs/common';
import { TicketMessage } from '../entities/ticket-message.entity';
import type { ITicketMessageRepository } from '../repositories/ticket-message.repository.interface';
import { CreateTicketMessageParams, UpdateTicketMessageParams } from 'src/utils/type';

@Injectable()
export class TicketMessageService {
  private readonly logger = new Logger(TicketMessageService.name);
  constructor(
    @Inject('ITicketMessageRepository')
    private readonly ticketMessageRepository: ITicketMessageRepository,
  ) {}

  async findById(id: string): Promise<TicketMessage | null> { 
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided: ${id}`);
      return null;
    }
    return this.ticketMessageRepository.findById(id);
  }

  async findAll(): Promise<TicketMessage[]> {
    this.logger.log('Fetching all ticket messages');
    return this.ticketMessageRepository.findAll();
  }

  async findByTicketId(ticketId: string): Promise<TicketMessage[]> {
    if (!ticketId || typeof ticketId !== 'string') {
      this.logger.warn(`Invalid ticketId provided: ${ticketId}`);
      return [];
    }
    this.logger.log(`Fetching ticket messages for ticketId: ${ticketId}`);
    return this.ticketMessageRepository.findByTicketId(ticketId);
  }

  async create(ticketMessage: CreateTicketMessageParams): Promise<TicketMessage> {
    this.logger.log(`Creating ticket message with data: ${JSON.stringify(ticketMessage)}`);
    return this.ticketMessageRepository.create(ticketMessage);
  }

  async update(id: string, ticketMessage: Partial<UpdateTicketMessageParams>): Promise<TicketMessage> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for update: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Updating ticket message ${id} with data: ${JSON.stringify(ticketMessage)}`);
    return this.ticketMessageRepository.update(id, ticketMessage);
  }

  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for deletion: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Deleting ticket message with id: ${id}`);
    return this.ticketMessageRepository.delete(id);
  }
}
