import { Module } from '@nestjs/common';
import { PromotionController } from '../controllers/promotion.controller';
import { PromotionService } from '../../domain/services/promotion.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaPromotionRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.promotion.repository';

@Module({
  imports: [PrismaModule],
  controllers: [PromotionController],
  providers: [
    PromotionService,
    {
      provide: 'IPromotionRepository',
      useClass: PrismaPromotionRepository,
    },
  ],
  exports: [PromotionService],
})
export class PromotionModule {}
