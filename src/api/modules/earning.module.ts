import { Module } from '@nestjs/common';
import { EarningController } from '../controllers/earning.controller';
import { EarningService } from '../../domain/services/earning.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaEarningRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.earning.repository';

@Module({
  imports: [PrismaModule],
  controllers: [EarningController],
  providers: [
    EarningService,
    {
      provide: 'IEarningRepository',
      useClass: PrismaEarningRepository,
    },
  ],
  exports: [EarningService, 'IEarningRepository'],
})
export class EarningModule {}
