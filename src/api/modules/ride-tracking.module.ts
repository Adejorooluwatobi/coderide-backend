import { Module } from '@nestjs/common';
import { RideTrackingController } from '../controllers/ride-tracking.controller';
import { RideTrackingService } from '../../domain/services/ride-tracking.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaRideTrackingRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.ride-tracking.repository';
import { RideTrackingGateway } from 'src/shared/websockets/ride-tracking.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [RideTrackingController],
  providers: [
    RideTrackingService,
    RideTrackingGateway,
    {
      provide: 'IRideTrackingRepository',
      useClass: PrismaRideTrackingRepository,
    },
  ],
  exports: [RideTrackingService, RideTrackingGateway],
})
export class RideTrackingModule {}
