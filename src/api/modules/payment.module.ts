import { Module } from '@nestjs/common';
import { PaymentController } from '../controllers/payment.controller';
import { WebhookController } from '../controllers/webhook.controller';
import { PaymentService } from '../../domain/services/payment.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaPaymentRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.payment.repository';
import { PrismaPaymentGatewayLogRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.payment-gateway-log.repository';
import { AuthModule } from '../auth/auth.module';
import { PaystackService } from 'src/infrastructure/external-services/paystack.service';
import { FlutterwaveService } from 'src/infrastructure/external-services/flutterwave.service';
import { NotificationModule } from './notification.module';
import { RideModule } from './ride.module';
import { WalletModule } from './wallet.module';
import { RideGateway } from 'src/shared/websockets/ride.gateway';
import { forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    NotificationModule,
    ConfigModule,
    forwardRef(() => RideModule),
    forwardRef(() => WalletModule),
  ],
  controllers: [PaymentController, WebhookController],
  providers: [
    PaymentService,
    PaystackService,
    FlutterwaveService,
    {
      provide: 'IPaymentRepository',
      useClass: PrismaPaymentRepository,
    },
    {
      provide: 'IPaymentGatewayLogRepository',
      useClass: PrismaPaymentGatewayLogRepository,
    },
  ],
  exports: [PaymentService, PaystackService, FlutterwaveService],
})
export class PaymentModule {}
