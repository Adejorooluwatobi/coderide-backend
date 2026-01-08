import { Module } from '@nestjs/common';
import { PaymentController } from '../controllers/payment.controller';
import { PaymentService } from '../../domain/services/payment.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaPaymentRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.payment.repository';
import { AuthModule } from '../auth/auth.module';
import { PaystackService } from 'src/infrastructure/external-services/paystack.service';
import { NotificationModule } from './notification.module';
import { RideModule } from './ride.module';
import { RideGateway } from 'src/shared/websockets/ride.gateway';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    NotificationModule,
    forwardRef(() => RideModule),
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaystackService,
    {
      provide: 'IPaymentRepository',
      useClass: PrismaPaymentRepository,
    },
  ],
  exports: [PaymentService, PaystackService],
})
export class PaymentModule {}
