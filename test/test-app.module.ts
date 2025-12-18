import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/application/use-cases/app.service';
import { ConfigModule } from '@nestjs/config';
import { LoggingMiddleware } from '../src/shared/middleware/logging.middleware';
import { PrismaModule } from '../src/infrastructure/persistence/prisma/prisma.module';
import { AdminModule } from '../src/api/modules/admin.module';
import { DriverModule } from '../src/api/modules/driver.module';
import { DriverDocumentModule } from '../src/api/modules/driver-document.module';
import { RiderModule } from '../src/api/modules/rider.module';
import { VehicleModule } from '../src/api/modules/vehicle.module';
import { VehicleAssignmentModule } from '../src/api/modules/vehicle-assignment.module';
import { FareEstimateModule } from '../src/api/modules/fare-estimate.module';
import { DriverScheduleModule } from '../src/api/modules/driver-schedule.module';
import { EarningModule } from '../src/api/modules/earning.module';
import { NotificationModule } from '../src/api/modules/notification.module';
import { PaymentModule } from '../src/api/modules/payment.module';
import { PaymentMethodModule } from '../src/api/modules/payment-method.module';
import { PromotionModule } from '../src/api/modules/promotion.module';
import { PromotionUsageModule } from '../src/api/modules/promotion-usage.module';
import { RatingModule } from '../src/api/modules/rating.module';
import { RideModule } from '../src/api/modules/ride.module';
import { SupportTicketModule } from '../src/api/modules/support-ticket.module';
import { SurgeZoneModule } from '../src/api/modules/surge-zone.module';
import { TicketMessageModule } from '../src/api/modules/ticket-message.module';
import { UserModule } from '../src/api/modules/user.module';
import { ReferralModule } from '../src/api/modules/referral.module';
import { RideTrackingModule } from '../src/api/modules/ride-tracking.module';
import { AuthModule } from '../src/api/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile: false,
    }),
    PrismaModule,
    AuthModule,
    AdminModule,
    DriverDocumentModule,
    DriverScheduleModule,
    DriverModule,
    EarningModule,
    FareEstimateModule,
    NotificationModule,
    PaymentMethodModule,
    PaymentModule,
    PromotionUsageModule,
    PromotionModule,
    RatingModule,
    ReferralModule,
    RideTrackingModule,
    RideModule,
    RiderModule,
    SupportTicketModule,
    SurgeZoneModule,
    TicketMessageModule,
    UserModule,
    VehicleModule,
    VehicleAssignmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class TestAppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}