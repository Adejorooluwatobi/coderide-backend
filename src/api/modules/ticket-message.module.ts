import { Module } from '@nestjs/common';
import { TicketMessageController } from '../controllers/ticket-message.controller';
import { TicketMessageService } from '../../domain/services/ticket-message.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaTicketMessageRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.ticket-message.repository';

@Module({
  imports: [PrismaModule],
  controllers: [TicketMessageController],
  providers: [
    TicketMessageService,
    {
      provide: 'ITicketMessageRepository',
      useClass: PrismaTicketMessageRepository,
    },
  ],
  exports: [TicketMessageService],
})
export class TicketMessageModule {}
