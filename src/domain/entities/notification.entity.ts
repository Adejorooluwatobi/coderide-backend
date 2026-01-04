import { NotificationType } from "../enums/notification.enum";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class Notification extends BaseEntity {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    user?: User;

    @ApiProperty()
    title: string;

    @ApiProperty()
    message: string;

    @ApiProperty()
    type: NotificationType;

    @ApiProperty()
    isRead: boolean;

    @ApiProperty()
    metadata?: unknown; // JSON

    @ApiProperty()
    actionUrl?: string;

    @ApiProperty()
    imageUrl?: string;

    @ApiProperty()
    expiresAt?: Date;

    @ApiProperty()
    readAt?: Date;

    constructor(data: Partial<Notification>) {
        super();
        Object.assign(this, data);
    }
}
