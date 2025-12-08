import { Inject, Injectable, Logger } from '@nestjs/common';
import { Earning } from '../entities/earning.entity';
import type { IEarningRepository } from '../repositories/earning.repository.interface';
import { CreateEarningParams, UpdateEarningParams } from 'src/utils/type';

@Injectable()
export class EarningService {
  private readonly logger = new Logger(EarningService.name);
  constructor(
    @Inject('IEarningRepository')
    private readonly earningRepository: IEarningRepository,
  ) {}

  async findById(id: string): Promise<Earning | null> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided: ${id}`);
      return null;
    }
    return this.earningRepository.findById(id);
  }

  async findAll(): Promise<Earning[]> {
    this.logger.log('Fetching all earnings');
    return this.earningRepository.findAll();
  }

  async findByRideId(rideId: string): Promise<Earning | null> {
    if (!rideId || typeof rideId !== 'string') {
      this.logger.warn(`Invalid rideId provided: ${rideId}`);
      return null;
    }
    return this.earningRepository.findByRideId(rideId);
  }

  async findByDriverId(driverId: string): Promise<Earning[]> {
    if (!driverId || typeof driverId !== 'string') {
      this.logger.warn(`Invalid driverId provided: ${driverId}`);
      return [];
    }
    return this.earningRepository.findByDriverId(driverId);
  }

  async create(earning: CreateEarningParams): Promise<Earning> {
    this.logger.log(`Creating earning with data: ${JSON.stringify(earning)}`);
    return this.earningRepository.create(earning);
  }

  async update(id: string, earning: Partial<UpdateEarningParams>): Promise<Earning> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for update: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Updating earning ${id} with data: ${JSON.stringify(earning)}`);
    return this.earningRepository.update(id, earning);
  }

  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for deletion: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Deleting earning with id: ${id}`);
    return this.earningRepository.delete(id);
  }
}
