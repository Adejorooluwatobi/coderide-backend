import { Inject, Injectable, Logger } from '@nestjs/common';
import { PromotionUsage } from '../entities/promotion-usage.entity';
import type { IPromotionUsageRepository } from '../repositories/promotion-usage.repository.interface';
import { CreatePromotionUsageParams, UpdatePromotionUsageParams } from 'src/utils/type';

@Injectable()
export class PromotionUsageService {
  private readonly logger = new Logger(PromotionUsageService.name);
  constructor(
    @Inject('IPromotionUsageRepository')
    private readonly promotionUsageRepository: IPromotionUsageRepository,
  ) {}

  async findById(id: string): Promise<PromotionUsage | null> { 
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided: ${id}`);
      return null;
    }
    return this.promotionUsageRepository.findById(id);
  }

  async findAll(): Promise<PromotionUsage[]> {
    this.logger.log('Fetching all promotion usages');
    return this.promotionUsageRepository.findAll();
  }

  async findByPromotionId(promotionId: string): Promise<PromotionUsage[]> {
    if (!promotionId || typeof promotionId !== 'string') {
      this.logger.warn(`Invalid promotionId provided: ${promotionId}`);
      return [];
    }
    return this.promotionUsageRepository.findByPromotionId(promotionId);
  }

  async findByRiderId(riderId: string): Promise<PromotionUsage[]> {
    if (!riderId || typeof riderId !== 'string') {
      this.logger.warn(`Invalid riderId provided: ${riderId}`);
      return [];
    }
    return this.promotionUsageRepository.findByRiderId(riderId);
  }

  async create(promotionUsage: CreatePromotionUsageParams): Promise<PromotionUsage> {
    this.logger.log(`Creating promotion usage with data: ${JSON.stringify(promotionUsage)}`);
    return this.promotionUsageRepository.create(promotionUsage);
  }

  async update(id: string, promotionUsage: Partial<UpdatePromotionUsageParams>): Promise<PromotionUsage> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for update: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Updating promotion usage with id: ${id} and data: ${JSON.stringify(promotionUsage)}`);
    return this.promotionUsageRepository.update(id, promotionUsage);
  }

  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for deletion: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Deleting promotion usage with id: ${id}`);
    return this.promotionUsageRepository.delete(id);
  }
}
