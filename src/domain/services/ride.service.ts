import { Inject, Injectable, Logger } from '@nestjs/common';
import { Ride } from '../entities/ride.entity';
import type { IRideRepository } from '../repositories/ride.repository.interface';
import { CreateRideParams, UpdateRideParams } from 'src/utils/type';
import { NotificationType } from '../enums/notification.enum';
import { NotificationService } from './notification.service';
import { DriverService } from './driver.service';
import { RiderService } from './rider.service';
import { PricingService } from './pricing.service';
import { getDistance } from 'geolib';
import { RideStatus } from '@prisma/client';
import { VehicleCategory } from '../enums/vehicle-category.enum';
import { EarningService } from './earning.service';
import { PayoutStatus } from '../enums/payout-status.enum';
import { SurgeZoneService } from './surge-zone.service';

@Injectable()
export class RideService {
  private readonly logger = new Logger(RideService.name);
  constructor(
    @Inject('IRideRepository')
    private readonly rideRepository: IRideRepository,
    private readonly notificationService: NotificationService,
    private readonly driverService: DriverService,
    private readonly riderService: RiderService,
    private readonly pricingService: PricingService,
    private readonly earningService: EarningService,
    private readonly surgeZoneService: SurgeZoneService,
  ) {}

  async findById(id: string): Promise<Ride | null> { 
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided: ${id}`);
      return null;
    }
    return this.rideRepository.findById(id);
  }

  async findAll(): Promise<Ride[]> {
    this.logger.log('Fetching all rides');
    return this.rideRepository.findAll();
  }

  async findByRiderId(riderId: string): Promise<Ride[]> {
    if (!riderId || typeof riderId !== 'string') {
      this.logger.warn(`Invalid riderId provided: ${riderId}`);
      return [];
    }
    return this.rideRepository.findByRiderId(riderId);
  }

  async findByDriverId(driverId: string): Promise<Ride[]> {
    if (!driverId || typeof driverId !== 'string') {
      this.logger.warn(`Invalid driverId provided: ${driverId}`);
      return [];
    }
    return this.rideRepository.findByDriverId(driverId);
  }

  async findByStatus(status: string): Promise<Ride[]> {
    if (!status || typeof status !== 'string') {
      this.logger.warn(`Invalid status provided: ${status}`);
      return [];
    }
    return this.rideRepository.findByStatus(status);
  }

  async create(ride: CreateRideParams): Promise<Ride> {
    this.logger.log(`Creating ride with data: ${JSON.stringify(ride)}`);
    
    // Calculate estimated price
    const distanceMeters = getDistance(
      { latitude: ride.pickupLatitude, longitude: ride.pickupLongitude },
      { latitude: ride.destinationLatitude, longitude: ride.destinationLongitude }
    );
    const distanceKm = distanceMeters / 1000;
    
    // Estimate duration: assume average speed of 40km/h in city
    const estimatedDurationMin = (distanceKm / 40) * 60; 

    // Get surge multiplier
    const surgeMultiplier = await this.surgeZoneService.getSurgeMultiplier(
      ride.pickupLatitude,
      ride.pickupLongitude
    );

    const estimatedPrice = this.pricingService.calculatePrice(
      distanceKm, 
      estimatedDurationMin, 
      (ride.rideType as unknown) as VehicleCategory,
      surgeMultiplier
    );

    const rideWithPrice = {
      ...ride,
      estimatedDistance: distanceKm,
      estimatedDuration: Math.ceil(estimatedDurationMin),
      estimatedPrice: estimatedPrice
    };

    const createdRide = await this.rideRepository.create(rideWithPrice);

    if (createdRide.driverId) {
      const driver = await this.driverService.findById(createdRide.driverId);
      if (driver) {
        await this.notificationService.create({
          userId: driver.userId,
          title: 'New Ride Booking',
          message: `A rider has booked you for a new ride from ${createdRide.pickupAddress} to ${createdRide.destinationAddress}. Est. Fare: ₦${estimatedPrice}`,
          type: NotificationType.RIDE_REQUEST,
          isRead: false,
        });
      }
    }

    // Notify Rider
    const rider = await this.riderService.findById(createdRide.riderId);
    if (rider) {
        await this.notificationService.create({
            userId: rider.userId,
            title: 'Ride Created',
            message: `Your ride request to ${createdRide.destinationAddress} has been created successfully. Est. Price: ₦${estimatedPrice}. Waiting for driver confirmation.`,
            type: NotificationType.RIDE_REQUEST,
            isRead: false,
        });
    }

    return createdRide;
  }

  async update(id: string, ride: Partial<UpdateRideParams>): Promise<Ride> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for update: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Updating ride with id: ${id} and data: ${JSON.stringify(ride)}`);
    return this.rideRepository.update(id, ride);
  }

  async updateStatus(id: string, status: string): Promise<Ride> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for update: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Updating ride status with id: ${id} and status: ${status}`);
    
    let updateData: any = { status };

    // If ride is completed, calculate final price
    if (status === RideStatus.COMPLETED) {
        const ride = await this.findById(id);
        // Only recalculate if we have valid coordinates. 
        if (ride && ride.pickupLatitude && ride.destinationLatitude) { 
             const distanceMeters = getDistance(
                { latitude: ride.pickupLatitude, longitude: ride.pickupLongitude },
                { latitude: ride.destinationLatitude, longitude: ride.destinationLongitude }
              );
              const distanceKm = distanceMeters / 1000;
              const durationMin = (distanceKm / 40) * 60; // Mock actual duration

              // Get surge multiplier (re-check at point of completion/pickup?)
              // Generally surge is locked at booking time. We use the original if we stored it.
              // For now, let's re-check at completion for simplicity or assume it's locked.
              // Ideally Ride model should store the surgeMultiplier.
              // Let's assume we locked it or we re-fetch it. I'll re-fetch for now.
              const surgeMultiplier = await this.surgeZoneService.getSurgeMultiplier(
                  ride.pickupLatitude,
                  ride.pickupLongitude
              );

              const finalPrice = this.pricingService.calculatePrice(
                distanceKm,
                durationMin,
                (ride.rideType as unknown) as VehicleCategory,
                surgeMultiplier
              );
              
              updateData = { ...updateData, actualPrice: finalPrice, actualDistance: distanceKm, actualDuration: Math.ceil(durationMin) };

              // Driver Earnings Logic: 80% to Driver, 20% to Platform
              const platformFee = Number(finalPrice) * 0.20;
              const netAmount = Number(finalPrice) - platformFee;

              if (ride.driverId) {
                  await this.earningService.create({
                    driverId: ride.driverId,
                    rideId: id,
                    grossAmount: finalPrice,
                    platformFee: platformFee,
                    netAmount: netAmount,
                    payoutStatus: PayoutStatus.PENDING,
                  });

                  this.logger.log(`Earnings created for driver ${ride.driverId}: Net ${netAmount}, Fee ${platformFee}`);
              }
        }
    }

    const updatedRide = await this.rideRepository.update(id, updateData); // Use update instead of updateStatus to save price

    // Notify Rider of status change
    const rider = await this.riderService.findById(updatedRide.riderId);
    if (rider) {
        await this.notificationService.create({
            userId: rider.userId,
            title: 'Ride Status Update',
            message: `Your ride status is now: ${status}`,
            type: NotificationType.RIDE_REQUEST, 
            isRead: false,
        });
    }

    return updatedRide;
  }

  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for deletion: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Deleting ride with id: ${id}`);
    return this.rideRepository.delete(id);
  }
}
