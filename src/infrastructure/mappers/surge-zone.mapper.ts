import { SurgeZone as PrismaSurgeZone } from '@prisma/client';
import { SurgeZone } from '../../domain/entities/surge-zone.entity';
import { Decimal } from '@prisma/client/runtime/library';

export class SurgeZoneMapper {
  static toDomain(prismaSurgeZone: PrismaSurgeZone): SurgeZone {
    return new SurgeZone({
      id: prismaSurgeZone.id,
      name: prismaSurgeZone.name,
      polygon: prismaSurgeZone.polygon,
      multiplier: Number(prismaSurgeZone.multiplier),
      isActive: prismaSurgeZone.isActive,
      startTime: prismaSurgeZone.startTime,
      endTime: prismaSurgeZone.endTime ?? undefined,
      createdAt: prismaSurgeZone.createdAt,
      updatedAt: prismaSurgeZone.updatedAt,
    });
  }

  static toPrisma(surgeZone: SurgeZone): Omit<PrismaSurgeZone, 'createdAt' | 'updatedAt'> {
    return {
      id: surgeZone.id,
      name: surgeZone.name,
      polygon: surgeZone.polygon,
      multiplier: surgeZone.multiplier ? new Decimal(surgeZone.multiplier) : new Decimal(1),
      isActive: surgeZone.isActive,
      startTime: surgeZone.startTime,
      endTime: surgeZone.endTime ?? null,
    };
  }
}
