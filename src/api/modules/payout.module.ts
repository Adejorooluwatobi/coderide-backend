import { Module } from '@nestjs/common';
import { PayoutService } from '../../domain/services/payout.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaPayoutRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.payout.repository';
import { PaymentModule } from './payment.module';
import { EarningModule } from './earning.module';
import { DriverModule } from './driver.module';
import { PayoutController } from '../controllers/payout.controller';

@Module({
  imports: [PrismaModule, PaymentModule, EarningModule, DriverModule],
  controllers: [PayoutController],
  providers: [
    PayoutService,
    {
      provide: 'IPayoutRepository',
      useClass: PrismaPayoutRepository,
    },
  ],
  exports: [PayoutService],
})
export class PayoutModule {}
