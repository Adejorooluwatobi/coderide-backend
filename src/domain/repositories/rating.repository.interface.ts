import { CreateRatingParams, UpdateRatingParams } from '../../utils/type';
import { Rating } from '../entities/rating.entity';

export interface IRatingRepository {
  findById(id: string): Promise<Rating | null>;
  findAll(): Promise<Rating[]>;
  findByRideId(rideId: string): Promise<Rating[]>;
  findByRateeId(rateeId: string): Promise<Rating[]>;
  create(rating: CreateRatingParams): Promise<Rating>;
  update(id: string, rating: Partial<UpdateRatingParams>): Promise<Rating>;
  delete(id: string): Promise<void>;
}
