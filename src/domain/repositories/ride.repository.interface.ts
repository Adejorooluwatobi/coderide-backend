import { CreateRideParams, UpdateRideParams } from '../../utils/type';
import { Ride } from '../entities/ride.entity';

export interface IRideRepository {
  findById(id: string): Promise<Ride | null>;
  findAll(): Promise<Ride[]>;
  findByRiderId(riderId: string): Promise<Ride[]>;
  findByDriverId(driverId: string): Promise<Ride[]>;
  findByStatus(status: string): Promise<Ride[]>;
  create(ride: CreateRideParams): Promise<Ride>;
  update(id: string, ride: Partial<UpdateRideParams>): Promise<Ride>;
  updateStatus(id: string, status: string): Promise<Ride>;
  delete(id: string): Promise<void>;
}
