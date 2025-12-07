import { Earning as PrismaEarning } from '@prisma/client';
import { Earning } from '../../domain/entities/earning.entity';
import { PayoutStatus } from 'src/domain/enums/payout-status.enum';
import { Decimal } from '@prisma/client/runtime/library';

export class EarningMapper {
  static toDomain(prismaEarning: PrismaEarning): Earning {
    return new Earning({
      id: prismaEarning.id,
      driverId: prismaEarning.driverId,
      rideId: prismaEarning.rideId,
      grossAmount: Number(prismaEarning.grossAmount),
      platformFee: Number(prismaEarning.platformFee),
      netAmount: Number(prismaEarning.netAmount),
      payoutStatus: prismaEarning.payoutStatus as PayoutStatus,
      paidOutAt: prismaEarning.paidOutAt ?? undefined,
      createdAt: prismaEarning.createdAt,
      updatedAt: prismaEarning.updatedAt,
    });
  }

  static toPrisma(earning: Earning): Omit<PrismaEarning, 'createdAt' | 'updatedAt'> {
    return {
      id: earning.id,
      driverId: earning.driverId,
      rideId: earning.rideId,
      grossAmount: new Decimal(earning.grossAmount),
      platformFee: new Decimal(earning.platformFee),
      netAmount: new Decimal(earning.netAmount),
      payoutStatus: earning.payoutStatus,
      paidOutAt: earning.paidOutAt ?? null,
    };
  }
}
