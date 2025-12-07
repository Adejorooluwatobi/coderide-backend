import { Vehicle as PrismaVehicle } from '@prisma/client';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { VehicleCategory } from 'src/domain/enums/vehicle-category.enum';
import { VehicleOwnership } from 'src/domain/enums/vehicle-ownership.enum';

export class VehicleMapper {
  static toDomain(prismaVehicle: PrismaVehicle): Vehicle {
    return new Vehicle({
      id: prismaVehicle.id,
      ownershipType: prismaVehicle.ownershipType as VehicleOwnership,
      ownerId: prismaVehicle.ownerId ?? undefined,
      licensePlate: prismaVehicle.licensePlate,
      make: prismaVehicle.make,
      model: prismaVehicle.model,
      year: prismaVehicle.year,
      color: prismaVehicle.color,
      category: prismaVehicle.category as VehicleCategory,
      seats: prismaVehicle.seats,
      insuranceExpiry: prismaVehicle.insuranceExpiry,
      vehiclePhotos: prismaVehicle.vehiclePhotos,
      isActive: prismaVehicle.isActive,
      createdAt: prismaVehicle.createdAt,
      updatedAt: prismaVehicle.updatedAt,
    });
  }

  static toPrisma(vehicle: Vehicle): Omit<PrismaVehicle, 'createdAt' | 'updatedAt'> {
    return {
      id: vehicle.id,
      ownershipType: vehicle.ownershipType as VehicleOwnership ,
      ownerId: vehicle.ownerId ?? null,
      licensePlate: vehicle.licensePlate,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
      category: vehicle.category,
      seats: vehicle.seats,
      insuranceExpiry: vehicle.insuranceExpiry,
      vehiclePhotos: vehicle.vehiclePhotos,
      isActive: vehicle.isActive,
    };
  }
}
