import { CreateRideTrackingParams, UpdateRideTrackingParams } from '../../utils/type';
import { RideTracking } from '../entities/ride-tracking.entity';

export interface IRideTrackingRepository {
  findById(id: string): Promise<RideTracking | null>;
  findAll(): Promise<RideTracking[]>;
  findByRideId(rideId: string): Promise<RideTracking[]>;
  create(rideTracking: CreateRideTrackingParams): Promise<RideTracking>;
  update(id: string, rideTracking: Partial<UpdateRideTrackingParams>): Promise<RideTracking>;
  delete(id: string): Promise<void>;
}
