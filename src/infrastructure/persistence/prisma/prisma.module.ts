import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaUserRepository } from './repositories/prisma.user.repository';
import { PrismaAdminRepository } from './repositories/prisma.admin.repository';
import { PrismaDriverRepository } from './repositories/prisma.driver.repository';
import { PrismaRiderRepository } from './repositories/prisma.rider.repository';
import { PrismaVehicleRepository } from './repositories/prisma.vehicle.repository';
import { PrismaVehicleAssignmentRepository } from './repositories/prisma.vehicle-assignment.repository';
import { PrismaRideRepository } from './repositories/prisma.ride.repository';
import { PrismaPaymentRepository } from './repositories/prisma.payment.repository';
import { PrismaPaymentMethodRepository } from './repositories/prisma.payment-method.repository';
import { PrismaEarningRepository } from './repositories/prisma.earning.repository';
import { PrismaRatingRepository } from './repositories/prisma.rating.repository';
import { PrismaNotificationRepository } from './repositories/prisma.notification.repository';
import { PrismaPromotionRepository } from './repositories/prisma.promotion.repository';
import { PrismaPromotionUsageRepository } from './repositories/prisma.promotion-usage.repository';
import { PrismaReferralRepository } from './repositories/prisma.referral.repository';
import { PrismaSupportTicketRepository } from './repositories/prisma.support-ticket.repository';
import { PrismaTicketMessageRepository } from './repositories/prisma.ticket-message.repository';
import { PrismaDriverDocumentRepository } from './repositories/prisma.driver-document.repository';
import { PrismaDriverScheduleRepository } from './repositories/prisma.driver-schedule.repository';
import { PrismaRideTrackingRepository } from './repositories/prisma.ride-tracking.repository';
import { PrismaFareEstimateRepository } from './repositories/prisma.fare-estimate.repository';
import { PrismaSurgeZoneRepository } from './repositories/prisma.surge-zone.repository';

@Global()
@Module({
  providers: [
    PrismaService,
    PrismaUserRepository,
    PrismaAdminRepository,
    PrismaDriverRepository,
    PrismaRiderRepository,
    PrismaVehicleRepository,
    PrismaVehicleAssignmentRepository,
    PrismaRideRepository,
    PrismaPaymentRepository,
    PrismaPaymentMethodRepository,
    PrismaEarningRepository,
    PrismaRatingRepository,
    PrismaNotificationRepository,
    PrismaPromotionRepository,
    PrismaPromotionUsageRepository,
    PrismaReferralRepository,
    PrismaSupportTicketRepository,
    PrismaTicketMessageRepository,
    PrismaDriverDocumentRepository,
    PrismaDriverScheduleRepository,
    PrismaRideTrackingRepository,
    PrismaFareEstimateRepository,
    PrismaSurgeZoneRepository,
  ],
  exports: [
    PrismaService,
    PrismaUserRepository,
    PrismaAdminRepository,
    PrismaDriverRepository,
    PrismaRiderRepository,
    PrismaVehicleRepository,
    PrismaVehicleAssignmentRepository,
    PrismaRideRepository,
    PrismaPaymentRepository,
    PrismaPaymentMethodRepository,
    PrismaEarningRepository,
    PrismaRatingRepository,
    PrismaNotificationRepository,
    PrismaPromotionRepository,
    PrismaPromotionUsageRepository,
    PrismaReferralRepository,
    PrismaSupportTicketRepository,
    PrismaTicketMessageRepository,
    PrismaDriverDocumentRepository,
    PrismaDriverScheduleRepository,
    PrismaRideTrackingRepository,
    PrismaFareEstimateRepository,
    PrismaSurgeZoneRepository,
  ],
})
export class PrismaModule {}
