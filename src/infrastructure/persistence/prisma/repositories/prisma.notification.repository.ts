import { Injectable } from '@nestjs/common';
import { INotificationRepository } from '../../../../domain/repositories/notification.repository.interface';
import { Notification } from '../../../../domain/entities/notification.entity';
import { Prisma } from '@prisma/client';
import { CreateNotificationParams, UpdateNotificationParams } from '../../../../utils/type';
import { PrismaService } from '../prisma.service';
import { NotificationMapper } from '../../../mappers/notification.mapper';

@Injectable()
export class PrismaNotificationRepository implements INotificationRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({ where: { id } });
    return notification ? NotificationMapper.toDomain(notification) : null;
  }

  async findAll(): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany();
    return notifications.map(NotificationMapper.toDomain);
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({ where: { userId } });
    return notifications.map(NotificationMapper.toDomain);
  }

  async create(params: CreateNotificationParams): Promise<Notification> {
    const notification = await this.prisma.notification.create({ data: params as Prisma.NotificationUncheckedCreateInput });
    return NotificationMapper.toDomain(notification);
  }

  async update(id: string, params: Partial<UpdateNotificationParams>): Promise<Notification> {
    const notification = await this.prisma.notification.update({ where: { id }, data: params as Prisma.NotificationUpdateInput });
    return NotificationMapper.toDomain(notification);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.notification.delete({ where: { id } });
  }
}
