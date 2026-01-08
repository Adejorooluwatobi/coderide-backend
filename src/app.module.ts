import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WinstonModule, utilities as nestWinstonUtilities } from 'nest-winston';
import * as winston from 'winston';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './application/use-cases/app.service';
import { FilesModule } from './shared/files/files.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggingMiddleware } from './shared/middleware/logging.middleware';
import { SanitizationMiddleware } from './shared/middleware/sanitization.middleware';
import { RequestIdMiddleware } from './shared/middleware/request-id.middleware';
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
import { PricingModule } from './api/modules/pricing.module';
import { ChatModule } from './api/modules/chat.module';
import { CustomThrottlerGuard } from './shared/guards/custom-throttler.guard';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { RedisService } from './shared/services/redis.service';
import { ResponseTransformInterceptor } from './shared/interceptors/response-transform.interceptor';
import { HealthController } from './api/controllers/health.controller';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        // 1. Print to Console (good for development)
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonUtilities.format.nestLike('CodeRide', { colors: true, prettyPrint: true }),
          ),
        }),
        // 2. Save Errors to a file (good for production)
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error', // Only saves errors here
        }),
        // 3. Save Everything to a combined file
        new winston.transports.File({
          filename: 'logs/combined.log',
        }),
      ],
    }),
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
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get('REDIS_HOST', '127.0.0.1'),
          port: parseInt(config.get('REDIS_PORT', '6379'), 10),
          password: config.get('REDIS_PASSWORD'),
          maxRetriesPerRequest: null,
        },
      }),
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 100, // limit each IP to 100 requests per ttl
    }]),
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
    PricingModule,
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
    ChatModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
    AppService,
    RedisService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware, SanitizationMiddleware, LoggingMiddleware)
      .forRoutes('*');
  }
}
