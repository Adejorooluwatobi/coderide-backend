import { CreateVehicleParams, UpdateVehicleParams } from '../../utils/type';
import { Vehicle } from '../entities/vehicle.entity';

export interface IVehicleRepository {
  findById(id: string): Promise<Vehicle | null>;
  findAll(): Promise<Vehicle[]>;
  findByLicensePlate(licensePlate: string): Promise<Vehicle | null>;
  findByOwnerId(ownerId: string): Promise<Vehicle[]>;
  findAvailableCompanyVehicles(): Promise<Vehicle[]>;
  create(vehicle: CreateVehicleParams): Promise<Vehicle>;
  update(id: string, vehicle: Partial<UpdateVehicleParams>): Promise<Vehicle>;
  delete(id: string): Promise<void>;
}
