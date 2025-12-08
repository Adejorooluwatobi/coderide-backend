import { CreateVehicleAssignmentParams, UpdateVehicleAssignmentParams } from '../../utils/type';
import { VehicleAssignment } from '../entities/vehicle-assignment.entity';

export interface IVehicleAssignmentRepository {
  findById(id: string): Promise<VehicleAssignment | null>;
  findAll(): Promise<VehicleAssignment[]>;
  findActiveByDriverId(driverId: string): Promise<VehicleAssignment | null>;
  findActiveByVehicleId(vehicleId: string): Promise<VehicleAssignment | null>;
  findByDriverId(driverId: string): Promise<VehicleAssignment[]>;
  findByVehicleId(vehicleId: string): Promise<VehicleAssignment[]>;
  create(vehicleAssignment: CreateVehicleAssignmentParams): Promise<VehicleAssignment>;
  update(id: string, vehicleAssignment: Partial<UpdateVehicleAssignmentParams>): Promise<VehicleAssignment>;
  delete(id: string): Promise<void>;
}
