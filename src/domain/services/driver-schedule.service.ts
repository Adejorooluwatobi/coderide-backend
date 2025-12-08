import { Inject, Injectable, Logger } from '@nestjs/common';
import { DriverSchedule } from '../entities/driver-schedule.entity';
import type { IDriverScheduleRepository } from '../repositories/driver-schedule.repository.interface';
import { CreateDriverScheduleParams, UpdateDriverScheduleParams } from 'src/utils/type';

@Injectable()
export class DriverScheduleService {
  private readonly logger = new Logger(DriverScheduleService.name);
  constructor(
    @Inject('IDriverScheduleRepository')
    private readonly driverScheduleRepository: IDriverScheduleRepository,
  ) {}

  async findById(id: string): Promise<DriverSchedule | null> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided: ${id}`);
      return null;
    }
    return this.driverScheduleRepository.findById(id);
  }

  async findAll(): Promise<DriverSchedule[]> {
    this.logger.log('Fetching all driver schedules');
    return this.driverScheduleRepository.findAll();
  }

  async findByDriverId(driverId: string): Promise<DriverSchedule[]> {
    if (!driverId || typeof driverId !== 'string') {
      this.logger.warn(`Invalid driverId provided: ${driverId}`);
      return [];
    }
    return this.driverScheduleRepository.findByDriverId(driverId);
  }

  async create(params: CreateDriverScheduleParams): Promise<DriverSchedule> {
    this.logger.log(`Creating driver schedule with params: ${JSON.stringify(params)}`);
    return this.driverScheduleRepository.create(params);
  }

  async update(id: string, params: Partial<UpdateDriverScheduleParams>): Promise<DriverSchedule> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for update: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Updating driver schedule ${id} with params: ${JSON.stringify(params)}`);
    return this.driverScheduleRepository.update(id, params);
  }

  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for deletion: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Deleting driver schedule with id: ${id}`);
    return this.driverScheduleRepository.delete(id);
  }
}
