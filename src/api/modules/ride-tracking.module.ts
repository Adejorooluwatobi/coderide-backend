import { Module } from '@nestjs/common';
import { RideTrackingController } from '../controllers/ride-tracking.controller';
import { RideTrackingService } from '../../domain/services/ride-tracking.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaRideTrackingRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.ride-tracking.repository';

@Module({
  imports: [PrismaModule],
  controllers: [RideTrackingController],
  providers: [
    RideTrackingService,
    {
      provide: 'IRideTrackingRepository',
      useClass: PrismaRideTrackingRepository,
    },
  ],
  exports: [RideTrackingService],
})
export class RideTrackingModule {}
