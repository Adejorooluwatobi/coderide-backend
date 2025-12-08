import { CreateNotificationParams, UpdateNotificationParams } from '../../utils/type';
import { Notification } from '../entities/notification.entity';

export interface INotificationRepository {
  findById(id: string): Promise<Notification | null>;
  findAll(): Promise<Notification[]>;
  findByUserId(userId: string): Promise<Notification[]>;
  create(notification: CreateNotificationParams): Promise<Notification>;
  update(id: string, notification: Partial<UpdateNotificationParams>): Promise<Notification>;
  delete(id: string): Promise<void>;
}
