import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Ride } from './ride.entity';
import { Admin } from './admin.entity';
import { TicketMessage } from './ticket-message.entity';
import { TicketCategory } from '../enums/ticket-category.enum';
import { TicketStatus } from '../enums/ticket-status.enum';
import { Priority } from '../enums/priority.enum';
import { ApiProperty } from '@nestjs/swagger';

export class SupportTicket extends BaseEntity {
    @ApiProperty({ type: () => User })
    user: User;

    @ApiProperty()
    userId: string;

    @ApiProperty({ type: () => Ride })
    ride?: Ride;

    @ApiProperty()
    rideId?: string;

    @ApiProperty()
    category: TicketCategory;

    @ApiProperty()
    subject: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    status: TicketStatus;

    @ApiProperty()
    priority: Priority;

    @ApiProperty({ type: () => Admin })
    assignedTo?: Admin;

    @ApiProperty()
    adminId?: string;

    @ApiProperty()
    resolvedAt?: Date;

    @ApiProperty({ type: () => [TicketMessage] })
    messages?: TicketMessage[];

    constructor(data: Partial<SupportTicket>) {
        super();
        Object.assign(this, data);
    }
}
