import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "./base.entity";
import { Chat } from "./chat.entity";
import { User } from "./user.entity";
import { Admin } from "./admin.entity";

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

    @ApiProperty()
    message: string;

    @ApiProperty()
    isRead: boolean;

    constructor(data: Partial<ChatMessage>) {
        super();
        Object.assign(this, data);
    }
}
