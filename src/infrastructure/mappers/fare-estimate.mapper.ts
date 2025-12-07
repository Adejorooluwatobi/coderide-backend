import { FareEstimate as PrismaFareEstimate } from '@prisma/client';
import { FareEstimate } from '../../domain/entities/fare-estimate.entity';
import { VehicleCategory } from 'src/domain/enums/vehicle-category.enum';
import { Decimal } from '@prisma/client/runtime/library';

export class FareEstimateMapper {
  static toDomain(prismaEstimate: PrismaFareEstimate): FareEstimate {
    return new FareEstimate({
      id: prismaEstimate.id,
      riderId: prismaEstimate.riderId ?? undefined,
      pickupLatitude: prismaEstimate.pickupLatitude,
      pickupLongitude: prismaEstimate.pickupLongitude,
      destinationLatitude: prismaEstimate.destinationLatitude,
      destinationLongitude: prismaEstimate.destinationLongitude,
      estimatedPrice: Number(prismaEstimate.estimatedPrice),
      estimatedDistance: Number(prismaEstimate.estimatedDistance),
      estimatedDuration: prismaEstimate.estimatedDuration,
      vehicleCategory: prismaEstimate.vehicleCategory as VehicleCategory,
      createdAt: prismaEstimate.createdAt,
    });
  }

  static toPrisma(estimate: FareEstimate): Omit<PrismaFareEstimate, 'id' | 'createdAt'> {
    return {
      riderId: estimate.riderId ?? null,
      pickupLatitude: estimate.pickupLatitude,
      pickupLongitude: estimate.pickupLongitude,
      destinationLatitude: estimate.destinationLatitude,
      destinationLongitude: estimate.destinationLongitude,
      estimatedPrice: new Decimal(estimate.estimatedPrice),
      estimatedDistance: new Decimal(estimate.estimatedDistance),
      estimatedDuration: estimate.estimatedDuration,
      vehicleCategory: estimate.vehicleCategory,
    };
  }
}
