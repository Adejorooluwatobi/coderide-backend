import { Module } from '@nestjs/common';
import { NotificationController } from '../controllers/notification.controller';
import { NotificationService } from '../../domain/services/notification.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaNotificationRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.notification.repository';
import { AuthModule } from '../auth/auth.module';
import { AppGateway } from 'src/shared/websockets/app.gateway';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    AppGateway,
    {
      provide: 'INotificationRepository',
      useClass: PrismaNotificationRepository,
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
