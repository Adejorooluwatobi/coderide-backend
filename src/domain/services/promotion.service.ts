import { Inject, Injectable, Logger } from '@nestjs/common';
import { Promotion } from '../entities/promotion.entity';
import type { IPromotionRepository } from '../repositories/promotion.repository.interface';
import { CreatePromotionParams, UpdatePromotionParams } from 'src/utils/type';

@Injectable()
export class PromotionService {
  private readonly logger = new Logger(PromotionService.name);
  constructor(
    @Inject('IPromotionRepository')
    private readonly promotionRepository: IPromotionRepository,
  ) {}

  async findById(id: string): Promise<Promotion | null> { 
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided: ${id}`);
      return null;
    }
    return this.promotionRepository.findById(id);
  }

  async findAll(): Promise<Promotion[]> {
    this.logger.log('Fetching all promotions');
    return this.promotionRepository.findAll();
  }

  async findByCode(code: string): Promise<Promotion | null> {
    if (!code || typeof code !== 'string') {
      this.logger.warn(`Invalid code provided: ${code}`);
      return null;
    }
    return this.promotionRepository.findByCode(code);
  }

  async findActivePromotions(): Promise<Promotion[]> {
    this.logger.log('Fetching active promotions');
    return this.promotionRepository.findActivePromotions();
  }

  async create(promotion: CreatePromotionParams): Promise<Promotion> {
    this.logger.log(`Creating promotion with data: ${JSON.stringify(promotion)}`);
    return this.promotionRepository.create(promotion);
  }

  async update(id: string, promotion: Partial<UpdatePromotionParams>): Promise<Promotion> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for update: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Updating promotion with id: ${id} and data: ${JSON.stringify(promotion)}`);
    return this.promotionRepository.update(id, promotion);
  }

  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for deletion: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Deleting promotion with id: ${id}`);
    return this.promotionRepository.delete(id);
  }
}
