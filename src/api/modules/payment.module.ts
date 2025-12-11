import { Module } from '@nestjs/common';
import { PaymentController } from '../controllers/payment.controller';
import { PaymentService } from '../../domain/services/payment.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaPaymentRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.payment.repository';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    {
      provide: 'IPaymentRepository',
      useClass: PrismaPaymentRepository,
    },
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
