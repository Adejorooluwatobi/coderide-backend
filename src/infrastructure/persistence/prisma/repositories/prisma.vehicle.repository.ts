import { Injectable } from '@nestjs/common';
import { IVehicleRepository } from '../../../../domain/repositories/vehicle.repository.interface';
import { Vehicle } from '../../../../domain/entities/vehicle.entity';
import { CreateVehicleParams, UpdateVehicleParams } from '../../../../utils/type';
import { PrismaService } from '../prisma.service';
import { VehicleMapper } from '../../../mappers/vehicle.mapper';
import { Prisma, VehicleOwnership } from '@prisma/client';

@Injectable()
export class PrismaVehicleRepository implements IVehicleRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Vehicle | null> {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id } });
    return vehicle ? VehicleMapper.toDomain(vehicle) : null;
  }

  async findAll(): Promise<Vehicle[]> {
    const vehicles = await this.prisma.vehicle.findMany();
    return vehicles.map(VehicleMapper.toDomain);
  }

  async findByLicensePlate(licensePlate: string): Promise<Vehicle | null> {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { licensePlate } });
    return vehicle ? VehicleMapper.toDomain(vehicle) : null;
  }

  async findByOwnerId(ownerId: string): Promise<Vehicle[]> {
    const vehicles = await this.prisma.vehicle.findMany({ where: { ownerId } });
    return vehicles.map(VehicleMapper.toDomain);
  }

  async findAvailableCompanyVehicles(): Promise<Vehicle[]> {
    const vehicles = await this.prisma.vehicle.findMany({
      where: {
        ownershipType: VehicleOwnership.COMPANY_OWNED,
        assignments: {
          none: {
            returnedAt: null,
          },
        },
      },
    });
    return vehicles.map(VehicleMapper.toDomain);
  }

  async create(params: CreateVehicleParams): Promise<Vehicle> {
    const vehicle = await this.prisma.vehicle.create({ data: params as Prisma.VehicleUncheckedCreateInput });
    return VehicleMapper.toDomain(vehicle);
  }

  async update(id: string, params: Partial<UpdateVehicleParams>): Promise<Vehicle> {
    const vehicle = await this.prisma.vehicle.update({ where: { id }, data: params as Prisma.VehicleUpdateInput });
    return VehicleMapper.toDomain(vehicle);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.vehicle.delete({ where: { id } });
  }
}
