import { Rider as PrismaRider } from '@prisma/client';
import { Rider } from '../../domain/entities/rider.entity';
import { Decimal } from '@prisma/client/runtime/library';

export class RiderMapper {
  static toDomain(prismaRider: PrismaRider): Rider {
    return new Rider({
      id: prismaRider.id,
      userId: prismaRider.userId,
      defaultPaymentMethodId: prismaRider.defaultPaymentMethodId ?? undefined,
      rating: prismaRider.rating ? Number(prismaRider.rating) : undefined,
      totalRides: prismaRider.totalRides ?? undefined,
      preferredLanguage: prismaRider.preferredLanguage ?? undefined,
      savedLocations: prismaRider.savedLocations ?? undefined,
    });
  }

  static toPrisma(rider: Rider): Omit<PrismaRider, 'id'> {
    return {
      userId: rider.userId,
      defaultPaymentMethodId: rider.defaultPaymentMethodId ?? null,
      rating: rider.rating ? new Decimal(rider.rating) : null,
      totalRides: rider.totalRides ?? 0,
      preferredLanguage: rider.preferredLanguage ?? null,
      savedLocations: rider.savedLocations ?? null,
    };
  }
}