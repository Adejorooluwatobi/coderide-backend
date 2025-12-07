import { Promotion as PrismaPromotion } from '@prisma/client';
import { Promotion } from '../../domain/entities/promotion.entity';
import { DiscountType } from 'src/domain/enums/promotion.enum';
import { Decimal } from '@prisma/client/runtime/library';

export class PromotionMapper {
  static toDomain(prismaPromotion: PrismaPromotion): Promotion {
    return new Promotion({
      id: prismaPromotion.id,
      code: prismaPromotion.code,
      description: prismaPromotion.description,
      discountType: prismaPromotion.discountType as DiscountType,
      discountValue: Number(prismaPromotion.discountValue),
      maxDiscount: prismaPromotion.maxDiscount ? Number(prismaPromotion.maxDiscount) : undefined,
      minRideAmount: prismaPromotion.minRideAmount ? Number(prismaPromotion.minRideAmount) : undefined,
      validFrom: prismaPromotion.validFrom,
      validUntil: prismaPromotion.validUntil,
      usageLimit: prismaPromotion.usageLimit,
      usedCount: prismaPromotion.usedCount,
      isActive: prismaPromotion.isActive,
      createdAt: prismaPromotion.createdAt,
      updatedAt: prismaPromotion.updatedAt,
    });
  }

  static toPrisma(promotion: Promotion): Omit<PrismaPromotion, 'createdAt' | 'updatedAt'> {
    return {
      id: promotion.id,
      code: promotion.code,
      description: promotion.description,
      discountType: promotion.discountType,
      discountValue: new Decimal(promotion.discountValue),
      maxDiscount: promotion.maxDiscount ? new Decimal(promotion.maxDiscount) : null,
      minRideAmount: promotion.minRideAmount ? new Decimal(promotion.minRideAmount) : null,
      validFrom: promotion.validFrom,
      validUntil: promotion.validUntil,
      usageLimit: promotion.usageLimit,
      usedCount: promotion.usedCount,
      isActive: promotion.isActive,
    };
  }
}
