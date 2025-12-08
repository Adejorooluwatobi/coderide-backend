import { CreateTicketMessageParams, UpdateTicketMessageParams } from '../../utils/type';
import { TicketMessage } from '../entities/ticket-message.entity';

export interface ITicketMessageRepository {
  findById(id: string): Promise<TicketMessage | null>;
  findAll(): Promise<TicketMessage[]>;
  findByTicketId(ticketId: string): Promise<TicketMessage[]>;
  create(ticketMessage: CreateTicketMessageParams): Promise<TicketMessage>;
  update(id: string, ticketMessage: Partial<UpdateTicketMessageParams>): Promise<TicketMessage>;
  delete(id: string): Promise<void>;
}
