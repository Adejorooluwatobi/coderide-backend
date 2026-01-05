import { Payout } from '../entities/payout.entity';
import { CreatePayoutParams, UpdatePayoutParams } from '../../utils/type';

export interface IPayoutRepository {
  findById(id: string): Promise<Payout | null>;
  findAll(): Promise<Payout[]>;
  findByDriverId(driverId: string): Promise<Payout[]>;
  create(payout: CreatePayoutParams): Promise<Payout>;
  update(id: string, payout: Partial<UpdatePayoutParams>): Promise<Payout>;
  delete(id: string): Promise<void>;
}
