import { Inject, Injectable, Logger } from '@nestjs/common';
import { FareEstimate } from '../entities/fare-estimate.entity';
import type { IFareEstimateRepository } from '../repositories/fare-estimate.repository.interface';
import { CreateFareEstimateParams, UpdateFareEstimateParams } from 'src/utils/type';

@Injectable()
export class FareEstimateService {
  private readonly logger = new Logger(FareEstimateService.name);
  constructor(
    @Inject('IFareEstimateRepository')
    private readonly fareEstimateRepository: IFareEstimateRepository,
  ) {}

  async findById(id: string): Promise<FareEstimate | null> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided: ${id}`);
      return null;
    }
    return this.fareEstimateRepository.findById(id);
  }

  async findAll(): Promise<FareEstimate[]> {
    this.logger.log('Fetching all fare estimates');
    return this.fareEstimateRepository.findAll();
  }

  async findByRiderId(riderId: string): Promise<FareEstimate[]> {
    if (!riderId || typeof riderId !== 'string') {
      this.logger.warn(`Invalid riderId provided: ${riderId}`);
      return [];
    }

    return this.fareEstimateRepository.findByRiderId(riderId);
  }

  async create(fareEstimate: CreateFareEstimateParams): Promise<FareEstimate> {
    this.logger.log(`Creating fare estimate with data: ${JSON.stringify(fareEstimate)}`);
    return this.fareEstimateRepository.create(fareEstimate);
  }

  async update(id: string, fareEstimate: Partial<UpdateFareEstimateParams>): Promise<FareEstimate> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for update: ${id}`);
      throw new Error('Invalid id provided');
    }

    this.logger.log(`Updating fare estimate ${id} with data: ${JSON.stringify(fareEstimate)}`);
    return this.fareEstimateRepository.update(id, fareEstimate);
  }

  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for deletion: ${id}`);
      throw new Error('Invalid id provided');
    }

    await this.fareEstimateRepository.delete(id);
  }
}
