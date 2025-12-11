import { Module } from '@nestjs/common';
import { PaymentMethodController } from '../controllers/payment-method.controller';
import { PaymentMethodService } from '../../domain/services/payment-method.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaPaymentMethodRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.payment-method.repository';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentMethodController],
  providers: [
    PaymentMethodService,
    {
      provide: 'IPaymentMethodRepository',
      useClass: PrismaPaymentMethodRepository,
    },
  ],
  exports: [PaymentMethodService],
})
export class PaymentMethodModule {}
