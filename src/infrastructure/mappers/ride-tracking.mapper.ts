import { RideTracking as PrismaRideTracking } from '@prisma/client';
import { RideTracking } from '../../domain/entities/ride-tracking.entity';
import { Decimal } from '@prisma/client/runtime/library';

export class RideTrackingMapper {
  static toDomain(prismaTracking: PrismaRideTracking): RideTracking {
    return new RideTracking({
      id: prismaTracking.id,
      rideId: prismaTracking.rideId,
      latitude: prismaTracking.latitude,
      longitude: prismaTracking.longitude,
      timestamp: prismaTracking.timestamp,
      speed: prismaTracking.speed ? Number(prismaTracking.speed) : undefined,
      heading: prismaTracking.heading ?? undefined,
    });
  }

  static toPrisma(tracking: RideTracking): Omit<PrismaRideTracking, 'id'> {
    return {
      rideId: tracking.rideId,
      latitude: tracking.latitude,
      longitude: tracking.longitude,
      timestamp: tracking.timestamp,
      speed: tracking.speed ? new Decimal(tracking.speed) : null,
      heading: tracking.heading ? tracking.heading : null,
    };
  }
}
