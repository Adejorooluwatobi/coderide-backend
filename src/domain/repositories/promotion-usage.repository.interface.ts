import { CreatePromotionUsageParams, UpdatePromotionUsageParams } from '../../utils/type';
import { PromotionUsage } from '../entities/promotion-usage.entity';

export interface IPromotionUsageRepository {
  findById(id: string): Promise<PromotionUsage | null>;
  findAll(): Promise<PromotionUsage[]>;
  findByPromotionId(promotionId: string): Promise<PromotionUsage[]>;
  findByRiderId(riderId: string): Promise<PromotionUsage[]>;
  create(promotionUsage: CreatePromotionUsageParams): Promise<PromotionUsage>;
  update(id: string, promotionUsage: Partial<UpdatePromotionUsageParams>): Promise<PromotionUsage>;
  delete(id: string): Promise<void>;
}
