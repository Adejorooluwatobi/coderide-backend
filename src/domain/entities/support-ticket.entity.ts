import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Ride } from './ride.entity';
import { Admin } from './admin.entity';
import { TicketMessage } from './ticket-message.entity';
import { TicketCategory } from '../enums/ticket-category.enum';
import { TicketStatus } from '../enums/ticket-status.enum';
import { Priority } from '../enums/priority.enum';

export class SupportTicket extends BaseEntity {
    user: User;
    userId: string;
    ride?: Ride;
    rideId?: string;
    category: TicketCategory;
    subject: string;
    description: string;
    status: TicketStatus;
    priority: Priority;
    assignedTo?: Admin;
    adminId?: string;
    resolvedAt?: Date;
    messages?: TicketMessage[];

    constructor(data: Partial<SupportTicket>) {
        super();
        Object.assign(this, data);
    }
}
