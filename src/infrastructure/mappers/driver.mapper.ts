import { Driver as PrismaDriver } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Driver } from '../../domain/entities/driver.entity';
import { DocumentStatus } from 'src/domain/enums/document-status.enum';
import { UserMapper } from './user.mapper';
import { VehicleMapper } from './vehicle.mapper';
import { RideMapper } from './ride.mapper';
import { DriverStatus } from 'src/domain/enums/driver-status.enum';
import { ChatMapper } from './chat.mapper';

export class DriverMapper {
  static toDomain(prismaDriver: any): Driver {
    return new Driver({
      id: prismaDriver.id,
      userId: prismaDriver.userId,
      licenseNumber: prismaDriver.licenseNumber,
      licenseExpiry: prismaDriver.licenseExpiry,
      rating: prismaDriver.rating ? Number(prismaDriver.rating) : undefined,
      totalRides: prismaDriver.totalRides,
      totalEarnings: Number(prismaDriver.totalEarnings),
      isOnline: prismaDriver.isOnline,
      status: prismaDriver.status as DriverStatus,
      latitude: prismaDriver.latitude ?? undefined,
      longitude: prismaDriver.longitude ?? undefined,
      documentStatus: prismaDriver.documentStatus as DocumentStatus,
      bankAccountDetails: prismaDriver.bankAccountDetails ?? undefined,
      // Mapping relations
      user: prismaDriver.user ? UserMapper.toDomain(prismaDriver.user) : undefined,
      ownedVehicles: prismaDriver.ownedVehicles?.map((v: any) => VehicleMapper.toDomain(v)) || [],
      assignedVehicles: prismaDriver.vehicleAssignments?.map((va: any) => ({
        ...VehicleMapper.toDomain(va.vehicle),
        assignedAt: va.assignedAt,
        returnedAt: va.returnedAt,
      })) || [],
      rides: prismaDriver.rides?.map((r: any) => RideMapper.toDomain(r)) || [],
      chats: prismaDriver.chats?.map((c: any) => ChatMapper.toDomain(c)) || [],
    });
  }

  static toPrisma(driver: Driver): Omit<PrismaDriver, 'id'> {
    return {
      userId: driver.userId,
      licenseNumber: driver.licenseNumber,
      licenseExpiry: driver.licenseExpiry,
      rating: driver.rating !== undefined ? new Decimal(driver.rating) : null,
      totalRides: driver.totalRides,
      totalEarnings: new Decimal(driver.totalEarnings),
      isOnline: driver.isOnline,
      status: driver.status as DriverStatus,
      latitude: driver.latitude ?? null,
      longitude: driver.longitude ?? null,
      documentStatus: driver.documentStatus as DocumentStatus,
      bankAccountDetails: (driver.bankAccountDetails as any) ?? null,
    };
  }
}