import { Module } from '@nestjs/common';
import { ChatController } from '../controllers/chat.controller';
import { ChatService } from '../../domain/services/chat.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaChatRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.chat.repository';
import { ChatGateway } from 'src/shared/websockets/chat.gateway';
import { JwtModule } from '@nestjs/jwt';
import { RiderModule } from './rider.module';
import { DriverModule } from './driver.module';
import { NotificationModule } from './notification.module';
import { forwardRef } from '@nestjs/common';
import { CloudinaryModule } from 'src/infrastructure/external-services/cloudinary.module';
import { LiveKitService } from 'src/infrastructure/messaging/livekit.service';
import { AppGateway } from 'src/shared/websockets/app.gateway';
import { FileUploadService } from 'src/shared/services/file-upload.service';
import { RedisService } from 'src/shared/services/redis.service';

@Module({
  imports: [
    PrismaModule,
    NotificationModule,
    CloudinaryModule,
    forwardRef(() => RiderModule),
    forwardRef(() => DriverModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatGateway,
    LiveKitService,
    AppGateway,
    FileUploadService,
    RedisService,
    {
      provide: 'IChatRepository',
      useClass: PrismaChatRepository,
    },
  ],
  exports: [ChatService, ChatGateway, AppGateway, LiveKitService],
})
export class ChatModule {}
