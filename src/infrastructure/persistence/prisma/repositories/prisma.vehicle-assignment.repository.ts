import { Injectable } from '@nestjs/common';
import { IVehicleAssignmentRepository } from '../../../../domain/repositories/vehicle-assignment.repository.interface';
import { VehicleAssignment } from '../../../../domain/entities/vehicle-assignment.entity';
import { CreateVehicleAssignmentParams, UpdateVehicleAssignmentParams } from '../../../../utils/type';
import { PrismaService } from '../prisma.service';
import { VehicleAssignmentMapper } from '../../../mappers/vehicle-assignment.mapper';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaVehicleAssignmentRepository implements IVehicleAssignmentRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<VehicleAssignment | null> {
    const assignment = await this.prisma.vehicleAssignment.findUnique({ where: { id } });
    return assignment ? VehicleAssignmentMapper.toDomain(assignment) : null;
  }

  async findAll(): Promise<VehicleAssignment[]> {
    const assignments = await this.prisma.vehicleAssignment.findMany();
    return assignments.map(VehicleAssignmentMapper.toDomain);
  }

  async findActiveByDriverId(driverId: string): Promise<VehicleAssignment | null> {
    const assignment = await this.prisma.vehicleAssignment.findFirst({
      where: { driverId, returnedAt: null },
    });
    return assignment ? VehicleAssignmentMapper.toDomain(assignment) : null;
  }

  async findActiveByVehicleId(vehicleId: string): Promise<VehicleAssignment | null> {
    const assignment = await this.prisma.vehicleAssignment.findFirst({
      where: { vehicleId, returnedAt: null },
    });
    return assignment ? VehicleAssignmentMapper.toDomain(assignment) : null;
  }

  async findByDriverId(driverId: string): Promise<VehicleAssignment[]> {
    const assignments = await this.prisma.vehicleAssignment.findMany({ where: { driverId } });
    return assignments.map(VehicleAssignmentMapper.toDomain);
  }

  async findByVehicleId(vehicleId: string): Promise<VehicleAssignment[]> {
    const assignments = await this.prisma.vehicleAssignment.findMany({ where: { vehicleId } });
    return assignments.map(VehicleAssignmentMapper.toDomain);
  }

  async create(params: CreateVehicleAssignmentParams): Promise<VehicleAssignment> {
    const assignment = await this.prisma.vehicleAssignment.create({ data: params as Prisma.VehicleAssignmentUncheckedCreateInput });
    return VehicleAssignmentMapper.toDomain(assignment);
  }

  async update(id: string, params: Partial<UpdateVehicleAssignmentParams>): Promise<VehicleAssignment> {
    const assignment = await this.prisma.vehicleAssignment.update({ where: { id }, data: params as Prisma.VehicleAssignmentUpdateInput });
    return VehicleAssignmentMapper.toDomain(assignment);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.vehicleAssignment.delete({ where: { id } });
  }
}
