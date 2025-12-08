import { CreatePromotionParams, UpdatePromotionParams } from '../../utils/type';
import { Promotion } from '../entities/promotion.entity';

export interface IPromotionRepository {
  findById(id: string): Promise<Promotion | null>;
  findAll(): Promise<Promotion[]>;
  findByCode(code: string): Promise<Promotion | null>;
  findActivePromotions(): Promise<Promotion[]>;
  create(promotion: CreatePromotionParams): Promise<Promotion>;
  update(id: string, promotion: Partial<UpdatePromotionParams>): Promise<Promotion>;
  delete(id: string): Promise<void>;
}
