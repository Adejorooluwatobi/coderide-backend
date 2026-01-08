import { Inject, Injectable, Logger } from '@nestjs/common';
import { Driver } from '../entities/driver.entity';
import type { IDriverRepository } from '../repositories/driver.repository.interface';
import { CreateCompanyDriverParams, CreateDriverApplicationParams, UpdateDriverParams } from 'src/utils/type';
import { PrismaService } from 'src/infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class DriverService {
  private readonly logger = new Logger(DriverService.name);
  constructor(
    @Inject('IDriverRepository')
    private readonly driverRepository: IDriverRepository,
    private prisma: PrismaService
  ) {}

  async findNearestDrivers(lat: number, lng: number, radiusKm: number = 5 ) {
    const drivers = await this.prisma.$queryRaw`
      SELECT id, latitude, longitude,
      ( 6371 * acos( cos( radians(${lat}) ) * cos( radians( latitude ) ) 
      * cos( radians( longitude ) - radians(${lng}) ) + sin( radians(${lat}) ) 
      * sin( radians( latitude ) ) ) ) AS distance
      FROM "Driver"
      WHERE "isOnline" = true
      HAVING distance < ${radiusKm}
      ORDER BY distance ASC
      LIMIT 10;
    `;
    
    return drivers;
  }

  async findById(id: string): Promise<Driver | null> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided: ${id}`);
      return null;
    }
    return this.driverRepository.findById(id);
  }

  async findAll(): Promise<Driver[]> {
    this.logger.log('Fetching all drivers');
    return this.driverRepository.findAll();
  }

  async findByUserId(userId: string): Promise<Driver | null> {
    if (!userId || typeof userId !== 'string') {
      this.logger.warn(`Invalid userId provided: ${userId}`);
      return null;
    }
    return this.driverRepository.findByUserId(userId);
  }

  async findByLicenseNumber(licenseNumber: string): Promise<Driver | null> {
    if (!licenseNumber || typeof licenseNumber !== 'string') {
      this.logger.warn(`Invalid licenseNumber provided: ${licenseNumber}`);
      return null;
    }
    return this.driverRepository.findByLicenseNumber(licenseNumber);
  }

  async createApplication(driver: CreateDriverApplicationParams): Promise<Driver> {
    this.logger.log(`Creating driver application for userId: ${driver.userId}`);
    return this.driverRepository.createApplication(driver);
  }

  async createCompanyDriver(driver: CreateCompanyDriverParams): Promise<Driver> {
    this.logger.log(`Creating company driver with data: ${JSON.stringify(driver)}`);
    return this.driverRepository.createCompanyDriver(driver);
  }

  async update(id: string, driver: Partial<UpdateDriverParams>): Promise<Driver> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for update: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Updating driver ${id} with data: ${JSON.stringify(driver)}`);
    return this.driverRepository.update(id, driver);
  }

  async updateStatus(id: string, status: string): Promise<Driver> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for status update: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Updating status for driver ${id} to ${status}`);
    return this.driverRepository.updateStatus(id, status);
  }

  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for deletion: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Deleting driver with id: ${id}`);
    return this.driverRepository.delete(id);
  }
}
