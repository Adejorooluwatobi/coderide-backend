import { Module } from '@nestjs/common';
import { RideController } from '../controllers/ride.controller';
import { RideService } from '../../domain/services/ride.service';
import { PrismaModule } from 'src/infrastructure/persistence/prisma/prisma.module';
import { PrismaRideRepository } from 'src/infrastructure/persistence/prisma/repositories/prisma.ride.repository';
import { RiderModule } from './rider.module';
import { JwtModule } from '@nestjs/jwt';
import { NotificationModule } from './notification.module';
import { DriverModule } from './driver.module';
import { EarningModule } from './earning.module';
import { SurgeZoneModule } from './surge-zone.module';

@Module({
  imports: [PrismaModule, RiderModule, JwtModule, NotificationModule, DriverModule, EarningModule, SurgeZoneModule],
  controllers: [RideController],
  providers: [
    RideService,
    {
      provide: 'IRideRepository',
      useClass: PrismaRideRepository,
    },
  ],
  exports: [RideService],
})
export class RideModule {}
