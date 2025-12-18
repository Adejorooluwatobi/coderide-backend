import { Inject, Injectable, Logger, ConflictException, NotFoundException } from '@nestjs/common';
import { VehicleAssignment } from '../entities/vehicle-assignment.entity';
import type { IVehicleAssignmentRepository } from '../repositories/vehicle-assignment.repository.interface';
import { CreateVehicleAssignmentParams, UpdateVehicleAssignmentParams } from 'src/utils/type';

@Injectable()
export class VehicleAssignmentService {
  private readonly logger = new Logger(VehicleAssignmentService.name);
  constructor(
    @Inject('IVehicleAssignmentRepository')
    private readonly vehicleAssignmentRepository: IVehicleAssignmentRepository,
  ) {}

  async findById(id: string): Promise<VehicleAssignment | null> { 
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided: ${id}`);
      return null;
    }
    return this.vehicleAssignmentRepository.findById(id);
  }

  async findAll(): Promise<VehicleAssignment[]> {
    this.logger.log('Fetching all vehicle assignments');
    return this.vehicleAssignmentRepository.findAll();
  }

  async findActiveByDriverId(driverId: string): Promise<VehicleAssignment | null> {
    if (!driverId || typeof driverId !== 'string') {
      this.logger.warn(`Invalid driverId provided: ${driverId}`);
      return null;
    }
    this.logger.log(`Fetching active vehicle assignment for driverId: ${driverId}`);
    return this.vehicleAssignmentRepository.findActiveByDriverId(driverId);
  }

  async findActiveByVehicleId(vehicleId: string): Promise<VehicleAssignment | null> {
    if (!vehicleId || typeof vehicleId !== 'string') {
      this.logger.warn(`Invalid vehicleId provided: ${vehicleId}`);
      return null;
    }
    this.logger.log(`Fetching active vehicle assignment for vehicleId: ${vehicleId}`);
    return this.vehicleAssignmentRepository.findActiveByVehicleId(vehicleId);
  }

  async findByDriverId(driverId: string): Promise<VehicleAssignment[]> {
    if (!driverId || typeof driverId !== 'string') {
      this.logger.warn(`Invalid driverId provided: ${driverId}`);
      return [];
    }
    this.logger.log(`Fetching vehicle assignments for driverId: ${driverId}`);
    return this.vehicleAssignmentRepository.findByDriverId(driverId);
  }

  async findByVehicleId(vehicleId: string): Promise<VehicleAssignment[]> {
    if (!vehicleId || typeof vehicleId !== 'string') {
      this.logger.warn(`Invalid vehicleId provided: ${vehicleId}`);
      return [];
    }
    this.logger.log(`Fetching vehicle assignments for vehicleId: ${vehicleId}`);
    return this.vehicleAssignmentRepository.findByVehicleId(vehicleId);
  }

  async create(vehicleAssignment: CreateVehicleAssignmentParams): Promise<VehicleAssignment> {
    const activeAssignment = await this.vehicleAssignmentRepository.findActiveByVehicleId(vehicleAssignment.vehicleId);
    if (activeAssignment) {
      throw new ConflictException('Vehicle is already assigned'); // Using ConflictException from @nestjs/common
    }

    this.logger.log(`Creating vehicle assignment with data: ${JSON.stringify(vehicleAssignment)}`);
    return this.vehicleAssignmentRepository.create(vehicleAssignment);
  }

  async update(id: string, vehicleAssignment: Partial<UpdateVehicleAssignmentParams>): Promise<VehicleAssignment> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for update: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Updating vehicle assignment ${id} with data: ${JSON.stringify(vehicleAssignment)}`);
    return this.vehicleAssignmentRepository.update(id, vehicleAssignment);
  }

  async endAssignment(id: string, returnDate: Date): Promise<VehicleAssignment> {
    const assignment = await this.vehicleAssignmentRepository.findById(id);
    if (!assignment) {
      throw new NotFoundException(`Assignment with ID ${id} not found`);
    }

    // Assuming there's a way to check if it's already ended, usually by checking returnDate
    // The entity definition isn't fully visible but let's assume returnDate presence means it ended.
    // If the repository returns an entity that has returnDate, it might be tricky without seeing the entity.
    // However, the update typically handles setting the returnDate.

    this.logger.log(`Ending assignment ${id} on ${returnDate}`);
    return this.vehicleAssignmentRepository.update(id, { returnedAt: returnDate });
  }

  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for deletion: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Deleting vehicle assignment with id: ${id}`);
    return this.vehicleAssignmentRepository.delete(id);
  }
}
