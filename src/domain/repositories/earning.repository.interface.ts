import { CreateEarningParams, UpdateEarningParams } from '../../utils/type';
import { Earning } from '../entities/earning.entity';

export interface IEarningRepository {
  findById(id: string): Promise<Earning | null>;
  findAll(): Promise<Earning[]>;
  findByRideId(rideId: string): Promise<Earning | null>;
  findByDriverId(driverId: string): Promise<Earning[]>;
  create(earning: CreateEarningParams): Promise<Earning>;
  update(id: string, earning: Partial<UpdateEarningParams>): Promise<Earning>;
  delete(id: string): Promise<void>;
}
