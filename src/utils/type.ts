import { CreateUserDto } from '../application/DTO/user/create-user.dto';
import { UpdateUserDto } from '../application/DTO/user/update-user.dto';
import { CreateAdminDto } from '../application/DTO/admin/create-admin.dto';
import { UpdateAdminDto } from '../application/DTO/admin/update-admin.dto';
import { CreateDriverDocumentDto } from '../application/DTO/driver-document/create-driver-document.dto';
import { UpdateDriverDocumentDto } from '../application/DTO/driver-document/update-driver-document.dto';
import { CreateDriverScheduleDto } from '../application/DTO/driver-schedule/create-driver-schedule.dto';
import { UpdateDriverScheduleDto } from '../application/DTO/driver-schedule/update-driver-schedule.dto';
import { CreateEarningDto } from '../application/DTO/earning/create-earning.dto';
import { UpdateEarningDto } from '../application/DTO/earning/update-earning.dto';
import { CreateDriverApplicationDto } from '../application/DTO/driver/create-driver-application.dto';
import { CreateCompanyDriverDto } from '../application/DTO/driver/create-company-driver.dto';
import { UpdateDriverDto } from '../application/DTO/driver/update-driver.dto';
import { CreateFareEstimateDto } from '../application/DTO/fare-estimate/create-fare-estimate.dto';
import { UpdateFareEstimateDto } from '../application/DTO/fare-estimate/update-fare-estimate.dto';
import { CreateNotificationDto } from '../application/DTO/notification/create-notification.dto';
import { UpdateNotificationDto } from '../application/DTO/notification/update-notification.dto';
import { CreatePaymentMethodDto } from '../application/DTO/payment-method/create-payment-method.dto';
import { UpdatePaymentMethodDto } from '../application/DTO/payment-method/update-payment-method.dto';
import { CreatePaymentDto } from '../application/DTO/payment/create-payment.dto';
import { UpdatePaymentDto } from '../application/DTO/payment/update-payment.dto';
import { CreatePromotionUsageDto } from '../application/DTO/promotion-usage/create-promotion-usage.dto';
import { UpdatePromotionUsageDto } from '../application/DTO/promotion-usage/update-promotion-usage.dto';
import { CreatePromotionDto } from '../application/DTO/promotion/create-promotion.dto';
import { UpdatePromotionDto } from '../application/DTO/promotion/update-promotion.dto';
import { CreateRatingDto } from '../application/DTO/rating/create-rating.dto';
import { UpdateRatingDto } from '../application/DTO/rating/update-rating.dto';
import { CreateReferralDto } from '../application/DTO/referral/create-referral.dto';
import { UpdateReferralDto } from '../application/DTO/referral/update-referral.dto';
import { CreateRideTrackingDto } from '../application/DTO/ride-tracking/create-ride-tracking.dto';
import { UpdateRideTrackingDto } from '../application/DTO/ride-tracking/update-ride-tracking.dto';
import { CreateRideDto } from '../application/DTO/ride/create-ride.dto';
import { UpdateRideDto } from '../application/DTO/ride/update-ride.dto';
import { CreateRiderDto } from '../application/DTO/rider/create-rider.dto';
import { UpdateRiderDto } from '../application/DTO/rider/update-rider.dto';
import { CreateSupportTicketDto } from '../application/DTO/support-ticket/create-support-ticket.dto';
import { UpdateSupportTicketDto } from '../application/DTO/support-ticket/update-support-ticket.dto';
import { CreateSurgeZoneDto } from '../application/DTO/surge-zone/create-surge-zone.dto';
import { UpdateSurgeZoneDto } from '../application/DTO/surge-zone/update-surge-zone.dto';
import { CreateTicketMessageDto } from '../application/DTO/ticket-message/create-ticket-message.dto';
import { UpdateTicketMessageDto } from '../application/DTO/ticket-message/update-ticket-message.dto';
import { CreateVehicleAssignmentDto } from '../application/DTO/vehicle-assignment/create-vehicle-assignment.dto';
import { UpdateVehicleAssignmentDto } from '../application/DTO/vehicle-assignment/update-vehicle-assignment.dto';
import { CreateVehicleDto } from '../application/DTO/vehicle/create-vehicle.dto';
import { UpdateVehicleDto } from '../application/DTO/vehicle/update-vehicle.dto';

// ============================================
// STANDARD PARAMS (No JWT modification needed)
// ============================================

export type CreateUserParams = CreateUserDto & { isActive?: boolean; isVerified?: boolean };
export type UpdateUserParams = UpdateUserDto;

export type CreateAdminParams = CreateAdminDto;
export type UpdateAdminParams = UpdateAdminDto;

export type CreateDriverDocumentParams = CreateDriverDocumentDto;
export type UpdateDriverDocumentParams = UpdateDriverDocumentDto;

export type CreateDriverScheduleParams = CreateDriverScheduleDto;
export type UpdateDriverScheduleParams = UpdateDriverScheduleDto;

export type CreateEarningParams = CreateEarningDto;
export type UpdateEarningParams = UpdateEarningDto;

export type CreateFareEstimateParams = CreateFareEstimateDto;
export type UpdateFareEstimateParams = UpdateFareEstimateDto;

export type CreateNotificationParams = CreateNotificationDto;
export type UpdateNotificationParams = UpdateNotificationDto;

export type CreatePaymentParams = CreatePaymentDto;
export type UpdatePaymentParams = UpdatePaymentDto;

export type CreatePromotionUsageParams = CreatePromotionUsageDto;
export type UpdatePromotionUsageParams = UpdatePromotionUsageDto;

export type CreatePromotionParams = CreatePromotionDto;
export type UpdatePromotionParams = UpdatePromotionDto;

export type CreateRatingParams = CreateRatingDto;
export type UpdateRatingParams = UpdateRatingDto;

export type CreateRideTrackingParams = CreateRideTrackingDto;
export type UpdateRideTrackingParams = UpdateRideTrackingDto;

export type CreateSurgeZoneParams = CreateSurgeZoneDto;
export type UpdateSurgeZoneParams = UpdateSurgeZoneDto;

export type CreateVehicleAssignmentParams = CreateVehicleAssignmentDto;
export type UpdateVehicleAssignmentParams = UpdateVehicleAssignmentDto;

export type CreateVehicleParams = CreateVehicleDto;
export type UpdateVehicleParams = UpdateVehicleDto;

// ============================================
// JWT-BASED PARAMS (userId added from JWT token)
// ============================================
// These params ADD userId/riderId/senderId to the DTO
// Controller extracts user ID from JWT token and passes to service
// Pattern: Params = DTO + { userId: string }

// DRIVER REGISTRATION (Two separate flows)
export type CreateDriverApplicationParams = CreateDriverApplicationDto & { userId: string }; // Independent drivers (self-service)
export type CreateCompanyDriverParams = CreateCompanyDriverDto; // Company drivers (admin creates, userId already in DTO)
export type UpdateDriverParams = UpdateDriverDto; // Both driver types can update

export type CreateRiderParams = CreateRiderDto & { userId: string };
export type UpdateRiderParams = UpdateRiderDto;

export type CreateRideParams = CreateRideDto & { riderId: string };
export type UpdateRideParams = UpdateRideDto;

export type CreatePaymentMethodParams = CreatePaymentMethodDto & { userId: string };
export type UpdatePaymentMethodParams = UpdatePaymentMethodDto;

export type CreateSupportTicketParams = CreateSupportTicketDto & { userId: string };
export type UpdateSupportTicketParams = UpdateSupportTicketDto;

export type CreateReferralParams = CreateReferralDto & { referredId: string };
export type UpdateReferralParams = UpdateReferralDto;

export type CreateTicketMessageParams = CreateTicketMessageDto & { senderId: string };
export type UpdateTicketMessageParams = UpdateTicketMessageDto;
