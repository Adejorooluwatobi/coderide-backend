import { BaseEntity } from './base.entity';
import { SupportTicket } from './support-ticket.entity';
import { User } from './user.entity';

export class TicketMessage extends BaseEntity {
    ticket: SupportTicket;
    ticketId: string;
    sender: User;
    senderId: string;
    message: string;
    isAdminReply: boolean;
    attachments?: string[];

    constructor(data: Partial<TicketMessage>) {
        super();
        Object.assign(this, data);
    }
}
