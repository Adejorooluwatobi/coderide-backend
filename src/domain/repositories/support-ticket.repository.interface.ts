import { CreateSupportTicketParams, UpdateSupportTicketParams } from '../../utils/type';
import { SupportTicket } from '../entities/support-ticket.entity';

export interface ISupportTicketRepository {
  findById(id: string): Promise<SupportTicket | null>;
  findAll(): Promise<SupportTicket[]>;
  findByUserId(userId: string): Promise<SupportTicket[]>;
  findByStatus(status: string): Promise<SupportTicket[]>;
  create(supportTicket: CreateSupportTicketParams): Promise<SupportTicket>;
  update(id: string, supportTicket: Partial<UpdateSupportTicketParams>): Promise<SupportTicket>;
  delete(id: string): Promise<void>;
}
