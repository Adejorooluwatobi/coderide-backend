import { ApiProperty } from "@nestjs/swagger";
import { AdminPermission } from "../enums/admin-permision.enum";
import { BaseEntity } from "./base.entity";
import { AdminStatus } from "../enums/admin-status.enum";
import { SupportTicket } from "./support-ticket.entity";
import { Chat } from "./chat.entity";
import { ChatMessage } from "./chat-message.entity";

export class Admin extends BaseEntity {
    @ApiProperty()
    username: string;

    @ApiProperty()
    password: string;
    
    // Stores the sum of all permissions (e.g., 32 + 4 = 36)
    @ApiProperty()
    permissions: AdminPermission; 

    @ApiProperty()
    status?: AdminStatus;

    @ApiProperty({ type: () => [SupportTicket] })
    assignedTickets?: SupportTicket[];

    @ApiProperty({ type: () => [Chat] })
    chats?: Chat[];

    @ApiProperty({ type: () => [ChatMessage] })
    chatMessages?: ChatMessage[];

    constructor(data: Partial<Admin>) {
        super();
        Object.assign(this, data);
    }
}