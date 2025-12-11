import { Module } from '@nestjs/common';
import { PromotionUsageController } from '../controllers/promotion-usage.controller';
import { PromotionUsageService } from '../../domain/services/promotion-usage.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaPromotionUsageRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.promotion-usage.repository';

@Module({
  imports: [PrismaModule],
  controllers: [PromotionUsageController],
  providers: [
    PromotionUsageService,
    {
      provide: 'IPromotionUsageRepository',
      useClass: PrismaPromotionUsageRepository,
    },
  ],
  exports: [PromotionUsageService],
})
export class PromotionUsageModule {}
