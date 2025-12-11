import { Module } from '@nestjs/common';
import { NotificationController } from '../controllers/notification.controller';
import { NotificationService } from '../../domain/services/notification.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaNotificationRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.notification.repository';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    {
      provide: 'INotificationRepository',
      useClass: PrismaNotificationRepository,
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
