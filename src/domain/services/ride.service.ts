import { Inject, Injectable, Logger } from '@nestjs/common';
import { Ride } from '../entities/ride.entity';
import type { IRideRepository } from '../repositories/ride.repository.interface';
import { CreateRideParams, UpdateRideParams } from 'src/utils/type';

@Injectable()
export class RideService {
  private readonly logger = new Logger(RideService.name);
  constructor(
    @Inject('IRideRepository')
    private readonly rideRepository: IRideRepository,
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
    return this.rideRepository.create(ride);
  }

  async update(id: string, ride: Partial<UpdateRideParams>): Promise<Ride> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for update: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Updating ride with id: ${id} and data: ${JSON.stringify(ride)}`);
    return this.rideRepository.update(id, ride);
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
