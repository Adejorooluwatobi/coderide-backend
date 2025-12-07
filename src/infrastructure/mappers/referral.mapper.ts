import { Referral as PrismaReferral } from '@prisma/client';
import { Referral } from '../../domain/entities/referral.entity';
import { ReferralStatus } from 'src/domain/enums/referral-status.enum';
import { Decimal } from '@prisma/client/runtime/library';

export class ReferralMapper {
  static toDomain(prismaReferral: PrismaReferral): Referral {
    return new Referral({
      id: prismaReferral.id,
      referrerId: prismaReferral.referrerId,
      referredId: prismaReferral.referredId,
      code: prismaReferral.code,
      status: prismaReferral.status as ReferralStatus,
      rewardAmount: prismaReferral.rewardAmount ? Number(prismaReferral.rewardAmount) : undefined,
      rewardedAt: prismaReferral.rewardedAt ?? undefined,
      createdAt: prismaReferral.createdAt,
      updatedAt: prismaReferral.updatedAt,
    });
  }

  static toPrisma(referral: Referral): Omit<PrismaReferral, 'createdAt' | 'updatedAt'> {
    return {
      id: referral.id,
      referrerId: referral.referrerId,
      referredId: referral.referredId,
      code: referral.code,
      status: referral.status,
      rewardAmount: referral.rewardAmount ? new Decimal(referral.rewardAmount) : null,
      rewardedAt: referral.rewardedAt ? referral.rewardedAt : null,
    };
  }
}
