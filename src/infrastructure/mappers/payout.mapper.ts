import { Payout as PrismaPayout, Earning as PrismaEarning } from '@prisma/client';
import { Payout } from '../../domain/entities/payout.entity';
import { EarningMapper } from './earning.mapper';

export class PayoutMapper {
  static toDomain(prismaPayout: PrismaPayout & { earnings?: PrismaEarning[] }): Payout {
    return new Payout({
      id: prismaPayout.id,
      driverId: prismaPayout.driverId,
      amount: Number(prismaPayout.amount),
      status: prismaPayout.status as any,
      transferReference: prismaPayout.transferReference || undefined,
      processedAt: prismaPayout.processedAt || undefined,
      createdAt: prismaPayout.createdAt,
      updatedAt: prismaPayout.updatedAt,
      earnings: prismaPayout.earnings ? prismaPayout.earnings.map(EarningMapper.toDomain) : [],
    });
  }
}
