import { Module } from '@nestjs/common';
import { ChatController } from '../controllers/chat.controller';
import { ChatService } from '../../domain/services/chat.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaChatRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.chat.repository';
import { ChatGateway } from 'src/shared/websockets/chat.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
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
