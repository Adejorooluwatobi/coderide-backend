import { NotificationType } from "../enums/notification.enum";
import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";

export class Notification extends BaseEntity {
    userId: string;
    user?: User;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    metadata?: unknown; // JSON

    constructor(data: Partial<Notification>) {
        super();
        Object.assign(this, data);
    }
}
