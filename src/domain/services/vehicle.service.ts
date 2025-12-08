import { Inject, Injectable, Logger } from '@nestjs/common';
import { Vehicle } from '../entities/vehicle.entity';
import type { IVehicleRepository } from '../repositories/vehicle.repository.interface';
import { CreateVehicleParams, UpdateVehicleParams } from 'src/utils/type';

@Injectable()
export class VehicleService {
  private readonly logger = new Logger(VehicleService.name);
  constructor(
    @Inject('IVehicleRepository')
    private readonly vehicleRepository: IVehicleRepository,
  ) {}

  async findById(id: string): Promise<Vehicle | null> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided: ${id}`);
      return null;
    }
    return this.vehicleRepository.findById(id);
  }

  async findAll(): Promise<Vehicle[]> {
    this.logger.log('Fetching all vehicles');
    return this.vehicleRepository.findAll();
  }

  async findByLicensePlate(licensePlate: string): Promise<Vehicle | null> {
    if (!licensePlate || typeof licensePlate !== 'string') {
      this.logger.warn(`Invalid license plate provided: ${licensePlate}`);
      return null;
    }
    this.logger.log(`Fetching vehicle with license plate: ${licensePlate}`);
    return this.vehicleRepository.findByLicensePlate(licensePlate);
  }

  async findByOwnerId(ownerId: string): Promise<Vehicle[]> {
    if (!ownerId || typeof ownerId !== 'string') {
      this.logger.warn(`Invalid ownerId provided: ${ownerId}`);
      return [];
    }
    this.logger.log(`Fetching vehicles for ownerId: ${ownerId}`);
    return this.vehicleRepository.findByOwnerId(ownerId);
  }

  async findAvailableCompanyVehicles(): Promise<Vehicle[]> {
    this.logger.log('Fetching available company vehicles');
    return this.vehicleRepository.findAvailableCompanyVehicles();
  }

  async create(vehicle: CreateVehicleParams): Promise<Vehicle> {
    this.logger.log('Creating a new vehicle');
    return this.vehicleRepository.create(vehicle);
  }

  async update(id: string, vehicle: Partial<UpdateVehicleParams>): Promise<Vehicle> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for update: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Updating vehicle with id: ${id}`);
    return this.vehicleRepository.update(id, vehicle);
  }

  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for deletion: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Deleting vehicle with id: ${id}`);
    return this.vehicleRepository.delete(id);
  }
}
