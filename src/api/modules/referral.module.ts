import { Module } from '@nestjs/common';
import { ReferralController } from '../controllers/referral.controller';
import { ReferralService } from '../../domain/services/referral.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaReferralRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.referral.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ReferralController],
  providers: [
    ReferralService,
    {
      provide: 'IReferralRepository',
      useClass: PrismaReferralRepository,
    },
  ],
  exports: [ReferralService],
})
export class ReferralModule {}
