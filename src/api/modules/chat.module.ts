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

@Module({
  imports: [
    PrismaModule,
    NotificationModule,
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
    {
      provide: 'IChatRepository',
      useClass: PrismaChatRepository,
    },
  ],
  exports: [ChatService, ChatGateway],
})
export class ChatModule {}
