import { Inject, Injectable, Logger } from '@nestjs/common';
import { DriverDocument } from '../entities/driver-document.entity';
import type { IDriverDocumentRepository } from '../repositories/driver-document.repository.interface';
import { CreateDriverDocumentParams, UpdateDriverDocumentParams } from 'src/utils/type';

@Injectable()
export class DriverDocumentService {
  private readonly logger = new Logger(DriverDocumentService.name);
  constructor(
    @Inject('IDriverDocumentRepository')
    private readonly driverDocumentRepository: IDriverDocumentRepository,
  ) {}

  async findById(id: string): Promise<DriverDocument | null> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided: ${id}`);
      return null;
    }
    return this.driverDocumentRepository.findById(id);
  }

  async findAll(): Promise<DriverDocument[]> {
    this.logger.log('Fetching all driver documents');
    return this.driverDocumentRepository.findAll();
  }

  async findByDriverId(driverId: string): Promise<DriverDocument[]> {
    if (!driverId || typeof driverId !== 'string') {
      this.logger.warn(`Invalid driverId provided: ${driverId}`);
      return [];
    }
    return this.driverDocumentRepository.findByDriverId(driverId);
  }

  async findByStatus(status: string): Promise<DriverDocument[]> {
    if (!status || typeof status !== 'string') {
      this.logger.warn(`Invalid status provided: ${status}`);
      return [];
    }
    return this.driverDocumentRepository.findByStatus(status);
  }
  
  async create(params: CreateDriverDocumentParams): Promise<DriverDocument> {
    this.logger.log(`Creating driver document with params: ${JSON.stringify(params)}`);
    return this.driverDocumentRepository.create(params);
  }

  async update(id: string, params: Partial<UpdateDriverDocumentParams>): Promise<DriverDocument> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for update: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Updating driver document ${id} with params: ${JSON.stringify(params)}`);
    return this.driverDocumentRepository.update(id, params);
  }

  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for deletion: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Deleting driver document with id: ${id}`);
    return this.driverDocumentRepository.delete(id);
  }
}
