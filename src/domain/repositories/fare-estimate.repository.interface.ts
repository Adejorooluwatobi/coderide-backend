import { CreateFareEstimateParams, UpdateFareEstimateParams } from '../../utils/type';
import { FareEstimate } from '../entities/fare-estimate.entity';

export interface IFareEstimateRepository {
  findById(id: string): Promise<FareEstimate | null>;
  findAll(): Promise<FareEstimate[]>;
  findByRiderId(riderId: string): Promise<FareEstimate[]>;
  create(fareEstimate: CreateFareEstimateParams): Promise<FareEstimate>;
  update(id: string, fareEstimate: Partial<UpdateFareEstimateParams>): Promise<FareEstimate>;
  delete(id: string): Promise<void>;
}
