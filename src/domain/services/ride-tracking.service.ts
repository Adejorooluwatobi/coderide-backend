import { Inject, Injectable, Logger } from '@nestjs/common';
import { RideTracking } from '../entities/ride-tracking.entity';
import type { IRideTrackingRepository } from '../repositories/ride-tracking.repository.interface';
import { CreateRideTrackingParams, UpdateRideTrackingParams } from 'src/utils/type';

@Injectable()
export class RideTrackingService {
  private readonly logger = new Logger(RideTrackingService.name);
  constructor(
    @Inject('IRideTrackingRepository')
    private readonly rideTrackingRepository: IRideTrackingRepository,
  ) {}

  async findById(id: string): Promise<RideTracking | null> { 
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided: ${id}`);
      return null;
    }
    return this.rideTrackingRepository.findById(id);
  }

  async findAll(): Promise<RideTracking[]> {
    this.logger.log('Fetching all ride trackings');
    return this.rideTrackingRepository.findAll();
  }

  async findByRideId(rideId: string): Promise<RideTracking[]> {
    if (!rideId || typeof rideId !== 'string') {
      this.logger.warn(`Invalid rideId provided: ${rideId}`);
      return [];
    }
    return this.rideTrackingRepository.findByRideId(rideId);
  }

  async create(rideTracking: CreateRideTrackingParams): Promise<RideTracking> {
    this.logger.log(`Creating ride tracking with data: ${JSON.stringify(rideTracking)}`);
    return this.rideTrackingRepository.create(rideTracking);
  }

  async update(id: string, rideTracking: Partial<UpdateRideTrackingParams>): Promise<RideTracking> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for update: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Updating ride tracking with id: ${id} and data: ${JSON.stringify(rideTracking)}`);
    return this.rideTrackingRepository.update(id, rideTracking);
  }

  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for deletion: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Deleting ride tracking with id: ${id}`);
    return this.rideTrackingRepository.delete(id);
  }
}
