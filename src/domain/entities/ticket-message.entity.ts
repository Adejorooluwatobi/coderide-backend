import { BaseEntity } from './base.entity';
import { SupportTicket } from './support-ticket.entity';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class TicketMessage extends BaseEntity {
    @ApiProperty()
    ticket: SupportTicket;

    @ApiProperty()
    ticketId: string;

    @ApiProperty()
    sender: User;

    @ApiProperty()
    senderId: string;

    @ApiProperty()
    message: string;

    @ApiProperty()
    isAdminReply: boolean;

    @ApiProperty()
    attachments?: string[];

    constructor(data: Partial<TicketMessage>) {
        super();
        Object.assign(this, data);
    }
}
