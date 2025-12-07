import { PromotionUsage as PrismaPromotionUsage } from '@prisma/client';
import { PromotionUsage } from '../../domain/entities/promotion-usage.entity';
import { Decimal } from '@prisma/client/runtime/library';

export class PromotionUsageMapper {
  static toDomain(prismaUsage: PrismaPromotionUsage): PromotionUsage {
    return new PromotionUsage({
      id: prismaUsage.id,
      promotionId: prismaUsage.promotionId,
      riderId: prismaUsage.riderId,
      rideId: prismaUsage.rideId,
      discountAmount: Number(prismaUsage.discountAmount),
      usedAt: prismaUsage.usedAt,
      createdAt: prismaUsage.createdAt,
      updatedAt: prismaUsage.updatedAt,
    });
  }

  static toPrisma(usage: PromotionUsage): Omit<PrismaPromotionUsage, 'createdAt' | 'updatedAt'> {
    return {
      id: usage.id,
      promotionId: usage.promotionId,
      riderId: usage.riderId,
      rideId: usage.rideId,
      discountAmount: new Decimal(usage.discountAmount),
      usedAt: usage.usedAt,
    };
  }
}
