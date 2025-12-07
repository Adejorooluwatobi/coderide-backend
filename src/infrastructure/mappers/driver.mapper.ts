import { Driver as PrismaDriver } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Driver } from '../../domain/entities/driver.entity';
import { DocumentStatus } from 'src/domain/enums/document-status.enum';

export class DriverMapper {
  static toDomain(prismaDriver: PrismaDriver): Driver {
    return new Driver({
      id: prismaDriver.id,
      userId: prismaDriver.userId,
      licenseNumber: prismaDriver.licenseNumber,
      licenseExpiry: prismaDriver.licenseExpiry,
      rating: prismaDriver.rating ? Number(prismaDriver.rating) : undefined,
      totalRides: prismaDriver.totalRides,
      totalEarnings: Number(prismaDriver.totalEarnings),
      isOnline: prismaDriver.isOnline,
      latitude: prismaDriver.latitude ?? undefined,
      longitude: prismaDriver.longitude ?? undefined,
      documentStatus: prismaDriver.documentStatus as DocumentStatus,
      bankAccountDetails: prismaDriver.bankAccountDetails ?? undefined,
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
      latitude: driver.latitude ?? null,
      longitude: driver.longitude ?? null,
      documentStatus: driver.documentStatus,
      bankAccountDetails: driver.bankAccountDetails ?? null,
    };
  }
}