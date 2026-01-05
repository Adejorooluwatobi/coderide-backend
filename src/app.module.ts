import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './application/use-cases/app.service';
import { FilesModule } from './shared/files/files.module';
import { ConfigModule } from '@nestjs/config';
import { LoggingMiddleware } from './shared/middleware/logging.middleware';
import { PrismaModule } from './infrastructure/persistence/prisma/prisma.module';
import { FastifyMulterModule } from '@nest-lab/fastify-multer';
import { AdminModule } from './api/modules/admin.module';
import { DriverModule } from './api/modules/driver.module';
import { DriverDocumentModule } from './api/modules/driver-document.module';
import { RiderModule } from './api/modules/rider.module';
import { VehicleModule } from './api/modules/vehicle.module';
import { VehicleAssignmentModule } from './api/modules/vehicle-assignment.module';
import { FareEstimateModule } from './api/modules/fare-estimate.module';
import { DriverScheduleModule } from './api/modules/driver-schedule.module';
import { EarningModule } from './api/modules/earning.module';
import { NotificationModule } from './api/modules/notification.module';
import { PaymentModule } from './api/modules/payment.module';
import { PaymentMethodModule } from './api/modules/payment-method.module';
import { PromotionModule } from './api/modules/promotion.module';
import { PromotionUsageModule } from './api/modules/promotion-usage.module';
import { RatingModule } from './api/modules/rating.module';
import { RideModule } from './api/modules/ride.module';
import { SupportTicketModule } from './api/modules/support-ticket.module';
import { SurgeZoneModule } from './api/modules/surge-zone.module';
import { TicketMessageModule } from './api/modules/ticket-message.module';
import { UserModule } from './api/modules/user.module';
import { ReferralModule } from './api/modules/referral.module';
import { RideTrackingModule } from './api/modules/ride-tracking.module';
import { AuthModule } from './api/auth/auth.module';
import { PayoutModule } from './api/modules/payout.module';

@Module({
  imports: [
    FilesModule,
    FastifyMulterModule.register({
      dest: './uploads',
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
      },
    }),
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
    PayoutModule,
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
