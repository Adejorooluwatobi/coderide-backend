import { Module } from '@nestjs/common';
import { SupportTicketController } from '../controllers/support-ticket.controller';
import { SupportTicketService } from '../../domain/services/support-ticket.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaSupportTicketRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.support-ticket.repository';

@Module({
  imports: [PrismaModule],
  controllers: [SupportTicketController],
  providers: [
    SupportTicketService,
    {
      provide: 'ISupportTicketRepository',
      useClass: PrismaSupportTicketRepository,
    },
  ],
  exports: [SupportTicketService],
})
export class SupportTicketModule {}
