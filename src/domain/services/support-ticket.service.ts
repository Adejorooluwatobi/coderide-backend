import { Inject, Injectable, Logger } from '@nestjs/common';
import { SupportTicket } from '../entities/support-ticket.entity';
import type { ISupportTicketRepository } from '../repositories/support-ticket.repository.interface';
import { CreateSupportTicketParams, UpdateSupportTicketParams } from 'src/utils/type';

@Injectable()
export class SupportTicketService {
  private readonly logger = new Logger(SupportTicketService.name);
  constructor(
    @Inject('ISupportTicketRepository')
    private readonly supportTicketRepository: ISupportTicketRepository,
  ) {}

  async findById(id: string): Promise<SupportTicket | null> { 
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided: ${id}`);
      return null;
    }
    return this.supportTicketRepository.findById(id);
  }

  async findAll(): Promise<SupportTicket[]> {
    this.logger.log('Fetching all support tickets');
    return this.supportTicketRepository.findAll();
  }

  async findByUserId(userId: string): Promise<SupportTicket[]> {
    if (!userId || typeof userId !== 'string') {
      this.logger.warn(`Invalid userId provided: ${userId}`);
      return [];
    }
    return this.supportTicketRepository.findByUserId(userId);
  }

  async findByStatus(status: string): Promise<SupportTicket[]> {
    if (!status || typeof status !== 'string') {
      this.logger.warn(`Invalid status provided: ${status}`);
      return [];
    }
    return this.supportTicketRepository.findByStatus(status);
  }

  async create(supportTicket: CreateSupportTicketParams): Promise<SupportTicket> {
    this.logger.log(`Creating support ticket with data: ${JSON.stringify(supportTicket)}`);
    return this.supportTicketRepository.create(supportTicket);
  }

  async update(id: string, supportTicket: Partial<UpdateSupportTicketParams>): Promise<SupportTicket> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for update: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Updating support ticket ${id} with data: ${JSON.stringify(supportTicket)}`);
    return this.supportTicketRepository.update(id, supportTicket);
  }

  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for deletion: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(` Deleting support ticket with id: ${id}`);
    return this.supportTicketRepository.delete(id);
  }
}
