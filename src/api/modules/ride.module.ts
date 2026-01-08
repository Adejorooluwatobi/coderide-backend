import { Module } from '@nestjs/common';
import { RideController } from '../controllers/ride.controller';
import { RideService } from '../../domain/services/ride.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaRideRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.ride.repository';
import { RiderModule } from './rider.module';
import { AuthModule } from '../auth/auth.module';
import { NotificationModule } from './notification.module';
import { DriverModule } from './driver.module';
import { EarningModule } from './earning.module';
import { SurgeZoneModule } from './surge-zone.module';
import { PricingModule } from './pricing.module';
import { RideTrackingModule } from './ride-tracking.module';
import { ChatModule } from './chat.module';

import { RideGateway } from 'src/shared/websockets/ride.gateway';

@Module({
  imports: [PrismaModule, RiderModule, AuthModule, NotificationModule, DriverModule, EarningModule, SurgeZoneModule, PricingModule, RideTrackingModule, ChatModule],
  controllers: [RideController],
  providers: [
    RideService,
    RideGateway,
    {
      provide: 'IRideRepository',
      useClass: PrismaRideRepository,
    },
  ],
  exports: [RideService, RideGateway],
})
 export class RideModule {}
