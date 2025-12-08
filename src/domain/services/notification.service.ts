import { Inject, Injectable, Logger } from '@nestjs/common';
import { Notification } from '../entities/notification.entity';
import type { INotificationRepository } from '../repositories/notification.repository.interface';
import { CreateNotificationParams, UpdateNotificationParams } from 'src/utils/type';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  constructor(
    @Inject('INotificationRepository')
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async findById(id: string): Promise<Notification | null> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided: ${id}`);
      return null;
    }
    return this.notificationRepository.findById(id);
  }

  async findAll(): Promise<Notification[]> {
    this.logger.log('Fetching all notifications');
    return this.notificationRepository.findAll();
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    if (!userId || typeof userId !== 'string') {
      this.logger.warn(`Invalid userId provided: ${userId}`);
      return [];
    }
    return this.notificationRepository.findByUserId(userId);
  }

  async create(notification: CreateNotificationParams): Promise<Notification> {
    this.logger.log(`Creating notification with data: ${JSON.stringify(notification)}`);
    return this.notificationRepository.create(notification);
  }

  async update(id: string, notification: Partial<UpdateNotificationParams>): Promise<Notification> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for update: ${id}`);
      throw new Error('Invalid id provided');
    }

    this.logger.log(`Updating notification ${id} with data: ${JSON.stringify(notification)}`);
    return this.notificationRepository.update(id, notification);
  }

  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for deletion: ${id}`);
      throw new Error('Invalid id provided');
    }

    await this.notificationRepository.delete(id);
  }
}
