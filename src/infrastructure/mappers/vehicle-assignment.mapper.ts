import { VehicleAssignment as PrismaVehicleAssignment } from '@prisma/client';
import { VehicleAssignment } from '../../domain/entities/vehicle-assignment.entity';
import { Decimal } from '@prisma/client/runtime/library';

export class VehicleAssignmentMapper {
  static toDomain(prismaAssignment: PrismaVehicleAssignment): VehicleAssignment {
    return new VehicleAssignment({
      id: prismaAssignment.id,
      vehicleId: prismaAssignment.vehicleId,
      driverId: prismaAssignment.driverId,
      assignedAt: prismaAssignment.assignedAt,
      returnedAt: prismaAssignment.returnedAt ?? undefined,
      startMileage: prismaAssignment.startMileage ?? undefined,
      endMileage: prismaAssignment.endMileage ?? undefined,
      fuelLevelStart: prismaAssignment.fuelLevelStart ? Number(prismaAssignment.fuelLevelStart) : undefined,
      fuelLevelEnd: prismaAssignment.fuelLevelEnd ? Number(prismaAssignment.fuelLevelEnd) : undefined,
      notes: prismaAssignment.notes ?? undefined,
      createdAt: prismaAssignment.createdAt,
      updatedAt: prismaAssignment.updatedAt,
    });
  }

  static toPrisma(assignment: VehicleAssignment): Omit<PrismaVehicleAssignment, 'createdAt' | 'updatedAt'> {
    return {
      id: assignment.id,
      vehicleId: assignment.vehicleId,
      driverId: assignment.driverId,
      assignedAt: assignment.assignedAt,
      returnedAt: assignment.returnedAt ?? null,
      startMileage: assignment.startMileage ?? null,
      endMileage: assignment.endMileage ?? null,
      fuelLevelStart: assignment.fuelLevelStart ? new Decimal(assignment.fuelLevelStart) : null,
      fuelLevelEnd: assignment.fuelLevelEnd ? new Decimal(assignment.fuelLevelEnd) : null,
      notes: assignment.notes ?? null,
    };
  }
}
