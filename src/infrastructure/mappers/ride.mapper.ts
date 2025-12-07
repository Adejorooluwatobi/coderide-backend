import { Ride as PrismaRide } from '@prisma/client';
import { Ride } from '../../domain/entities/ride.entity';
import { CancelledBy, RideStatus } from 'src/domain/enums/ride-status.enum';
import { VehicleCategory } from 'src/domain/enums/vehicle-category.enum';
import { Decimal } from '@prisma/client/runtime/library';

export class RideMapper {
  static toDomain(prismaRide: PrismaRide): Ride {
    return new Ride({
      id: prismaRide.id,
      riderId: prismaRide.riderId,
      driverId: prismaRide.driverId ?? undefined,
      pickupLatitude: prismaRide.pickupLatitude,
      pickupLongitude: prismaRide.pickupLongitude,
      pickupAddress: prismaRide.pickupAddress,
      destinationLatitude: prismaRide.destinationLatitude,
      destinationLongitude: prismaRide.destinationLongitude,
      destinationAddress: prismaRide.destinationAddress,
      status: prismaRide.status as RideStatus,
      rideType: prismaRide.rideType as VehicleCategory,
      estimatedDistance: prismaRide.estimatedDistance ? Number(prismaRide.estimatedDistance) : undefined,
      actualDistance: prismaRide.actualDistance ? Number(prismaRide.actualDistance) : undefined,
      estimatedDuration: prismaRide.estimatedDuration ?? undefined,
      actualDuration: prismaRide.actualDuration ?? undefined,
      estimatedPrice: prismaRide.estimatedPrice ? Number(prismaRide.estimatedPrice) : undefined,
      actualPrice: prismaRide.actualPrice ? Number(prismaRide.actualPrice) : undefined,
      requestedAt: prismaRide.requestedAt,
      acceptedAt: prismaRide.acceptedAt ?? undefined,
      startedAt: prismaRide.startedAt ?? undefined,
      completedAt: prismaRide.completedAt ?? undefined,
      cancelledAt: prismaRide.cancelledAt ?? undefined,
      cancellationReason: prismaRide.cancellationReason ?? undefined,
      cancelledBy: prismaRide.cancelledBy as CancelledBy,
    });
  }

  static toPrisma(ride: Ride): Omit<PrismaRide, 'id'> {
    return {
      riderId: ride.riderId,
      driverId: ride.driverId ?? null,
      pickupLatitude: ride.pickupLatitude,
      pickupLongitude: ride.pickupLongitude,
      pickupAddress: ride.pickupAddress,
      destinationLatitude: ride.destinationLatitude,
      destinationLongitude: ride.destinationLongitude,
      destinationAddress: ride.destinationAddress,
      status: ride.status,
      rideType: ride.rideType,
      estimatedDistance: ride.estimatedDistance ? new Decimal(ride.estimatedDistance) : null,
      actualDistance: ride.actualDistance ? new Decimal(ride.actualDistance) : null,
      estimatedDuration: ride.estimatedDuration ?? null,
      actualDuration: ride.actualDuration ?? null,
      estimatedPrice: ride.estimatedPrice ? new Decimal(ride.estimatedPrice) : null,
      actualPrice: ride.actualPrice ? new Decimal(ride.actualPrice) : null,
      requestedAt: ride.requestedAt,
      acceptedAt: ride.acceptedAt ?? null,
      startedAt: ride.startedAt ?? null,
      completedAt: ride.completedAt ?? null,
      cancelledAt: ride.cancelledAt ?? null,
      cancellationReason: ride.cancellationReason ?? null,
      cancelledBy: ride.cancelledBy ?? null,
    };
  }
}
