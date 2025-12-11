import { Module } from '@nestjs/common';
import { FareEstimateController } from '../controllers/fare-estimate.controller';
import { FareEstimateService } from '../../domain/services/fare-estimate.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaFareEstimateRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.fare-estimate.repository';

@Module({
  imports: [PrismaModule],
  controllers: [FareEstimateController],
  providers: [
    FareEstimateService,
    {
      provide: 'IFareEstimateRepository',
      useClass: PrismaFareEstimateRepository,
    },
  ],
  exports: [FareEstimateService],
})
export class FareEstimateModule {}
