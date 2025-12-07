import { Notification as PrismaNotification } from '@prisma/client';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationType } from 'src/domain/enums/notification.enum';

export class NotificationMapper {
  static toDomain(prismaNotification: PrismaNotification): Notification {
    return new Notification({
      id: prismaNotification.id,
      userId: prismaNotification.userId,
      title: prismaNotification.title,
      message: prismaNotification.message,
      type: prismaNotification.type as NotificationType,
      isRead: prismaNotification.isRead,
      metadata: prismaNotification.metadata ?? undefined,
      actionUrl: prismaNotification.actionUrl ?? undefined,
      imageUrl: prismaNotification.imageUrl ?? undefined,
      expiresAt: prismaNotification.expiresAt ?? undefined,
      readAt: prismaNotification.readAt ?? undefined,
      createdAt: prismaNotification.createdAt,
    });
  }

  static toPrisma(notification: Notification): Omit<PrismaNotification, 'id' | 'createdAt'> {
    return {
      userId: notification.userId,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      isRead: notification.isRead,
      metadata: notification.metadata ?? null,
      actionUrl: notification.actionUrl ?? null,
      imageUrl: notification.imageUrl ?? null,
      expiresAt: notification.expiresAt ?? null,
      readAt: notification.readAt ?? null,
    };
  }
}
