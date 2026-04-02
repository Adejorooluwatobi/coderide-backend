import { Module, forwardRef } from '@nestjs/common';
import { WalletController } from '../controllers/wallet.controller';
import { AdminWalletController } from '../controllers/admin-wallet.controller';
import { WalletService } from '../../domain/services/wallet.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaWalletRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.wallet.repository';
import { NotificationModule } from './notification.module';
import { AuthModule } from '../auth/auth.module';
import { PaymentModule } from './payment.module';

@Module({
  imports: [
    PrismaModule,
    NotificationModule,
    forwardRef(() => AuthModule),
    forwardRef(() => PaymentModule),
  ],
  controllers: [WalletController, AdminWalletController],
  providers: [
    WalletService,
    {
      provide: 'IWalletRepository',
      useClass: PrismaWalletRepository,
    },
  ],
  exports: [WalletService],
})
export class WalletModule {}
