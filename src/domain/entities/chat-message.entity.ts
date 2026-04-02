import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "./base.entity";
import { Chat } from "./chat.entity";
import { User } from "./user.entity";
import { Admin } from "./admin.entity";
import { ChatMessageType } from "../enums/chat-message-type.enum";

export class ChatMessage extends BaseEntity {
    @ApiProperty()
    chatId: string;

    @ApiProperty({ type: () => Chat })
    chat?: Chat;

    @ApiProperty()
    senderUserId?: string;

    @ApiProperty({ type: () => User })
    senderUser?: User;

    @ApiProperty()
    senderAdminId?: string;

    @ApiProperty({ type: () => Admin })
    senderAdmin?: Admin;

    @ApiProperty({ required: false })
    message?: string;

    @ApiProperty({ enum: ChatMessageType })
    type: ChatMessageType;

    @ApiProperty({ required: false })
    attachmentUrl?: string;

    @ApiProperty({ required: false })
    mimeType?: string;

    @ApiProperty({ required: false })
    fileSize?: number;

    @ApiProperty({ required: false })
    duration?: number;

    @ApiProperty()
    isRead: boolean;

    @ApiProperty()
    isDelivered: boolean;

    @ApiProperty({ required: false })
    readAt?: Date;

    @ApiProperty({ required: false })
    deliveredAt?: Date;

    constructor(data: Partial<ChatMessage>) {
        super();
        Object.assign(this, data);
    }
}
