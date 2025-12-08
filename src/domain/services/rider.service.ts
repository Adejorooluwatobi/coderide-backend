import { Inject, Injectable, Logger } from '@nestjs/common';
import { Rider } from '../entities/rider.entity';
import type { IRiderRepository } from '../repositories/rider.repository.interface';
import { CreateRiderParams, UpdateRiderParams } from 'src/utils/type';

@Injectable()
export class RiderService {
  private readonly logger = new Logger(RiderService.name);
  constructor(
    @Inject('IRiderRepository')
    private readonly riderRepository: IRiderRepository,
  ) {}

  async findById(id: string): Promise<Rider | null> { 
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided: ${id}`);
      return null;
    }
    return this.riderRepository.findById(id);
  }

  async findAll(): Promise<Rider[]> {
    this.logger.log('Fetching all riders');
    return this.riderRepository.findAll();
  }

  async findByUserId(userId: string): Promise<Rider | null> {
    if (!userId || typeof userId !== 'string') {
      this.logger.warn(`Invalid userId provided: ${userId}`);
      return null;
    }
    return this.riderRepository.findByUserId(userId);
  }

  async findByDefaultPaymentMethodId(defaultPaymentMethodId: string): Promise<Rider | null> {
    if (!defaultPaymentMethodId || typeof defaultPaymentMethodId !== 'string') {
      this.logger.warn(`Invalid defaultPaymentMethodId provided: ${defaultPaymentMethodId}`);
      return null;
    }
    return this.riderRepository.findByDefaultPaymentMethodId(defaultPaymentMethodId);
  }

  async create(rider: CreateRiderParams): Promise<Rider> {
    this.logger.log(`Creating rider with data: ${JSON.stringify(rider)}`);
    return this.riderRepository.create(rider);
  }

  async update(id: string, rider: Partial<UpdateRiderParams>): Promise<Rider> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for update: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Updating rider ${id} with data: ${JSON.stringify(rider)}`);
    return this.riderRepository.update(id, rider);
  }

  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for deletion: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Deleting rider with id: ${id}`);
    return this.riderRepository.delete(id);
  }
}
