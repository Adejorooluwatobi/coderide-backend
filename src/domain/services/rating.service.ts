import { Inject, Injectable, Logger } from '@nestjs/common';
import { Rating } from '../entities/rating.entity';
import type { IRatingRepository } from '../repositories/rating.repository.interface';
import { CreateRatingParams, UpdateRatingParams } from 'src/utils/type';

@Injectable()
export class RatingService {
  private readonly logger = new Logger(RatingService.name);
  constructor(
    @Inject('IRatingRepository')
    private readonly ratingRepository: IRatingRepository,
  ) {}

  async findById(id: string): Promise<Rating | null> { 
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided: ${id}`);
      return null;
    }
    return this.ratingRepository.findById(id);
  }

  async findAll(): Promise<Rating[]> {
    this.logger.log('Fetching all ratings');
    return this.ratingRepository.findAll();
  }

  async findByRideId(rideId: string): Promise<Rating[]> {
    if (!rideId || typeof rideId !== 'string') {
      this.logger.warn(`Invalid rideId provided: ${rideId}`);
      return [];
    }
    return this.ratingRepository.findByRideId(rideId);
  }

  async findByRateeId(rateeId: string): Promise<Rating[]> {
    if (!rateeId || typeof rateeId !== 'string') {
      this.logger.warn(`Invalid rateeId provided: ${rateeId}`);
      return [];
    }
    return this.ratingRepository.findByRateeId(rateeId);
  }

  async create(rating: CreateRatingParams): Promise<Rating> {
    this.logger.log(`Creating rating with data: ${JSON.stringify(rating)}`);
    return this.ratingRepository.create(rating);
  }

  async update(id: string, rating: Partial<UpdateRatingParams>): Promise<Rating> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for update: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Updating rating with id: ${id} and data: ${JSON.stringify(rating)}`);
    return this.ratingRepository.update(id, rating);
  }

  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for deletion: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Deleting rating with id: ${id}`);
    return this.ratingRepository.delete(id);
  }
}
