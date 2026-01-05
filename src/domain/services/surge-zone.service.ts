import { Inject, Injectable, Logger } from '@nestjs/common';
import { SurgeZone } from '../entities/surge-zone.entity';
import type { ISurgeZoneRepository } from '../repositories/surge-zone.repository.interface';
import { CreateSurgeZoneParams, UpdateSurgeZoneParams } from 'src/utils/type';
import { isPointInPolygon } from 'geolib';

@Injectable()
export class SurgeZoneService {
  private readonly logger = new Logger(SurgeZoneService.name);
  constructor(
    @Inject('ISurgeZoneRepository')
    private readonly surgeZoneRepository: ISurgeZoneRepository,
  ) {}

  async findById(id: string): Promise<SurgeZone | null> { 
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided: ${id}`);
      return null;
    }
    return this.surgeZoneRepository.findById(id);
  }

  async findAll(): Promise<SurgeZone[]> {
    this.logger.log('Fetching all surge zones');
    return this.surgeZoneRepository.findAll();
  }

  async findActiveSurgeZones(): Promise<SurgeZone[]> {
    this.logger.log('Fetching active surge zones');
    return this.surgeZoneRepository.findActiveSurgeZones();
  }

  async getSurgeMultiplier(latitude: number, longitude: number): Promise<number> {
    const activeZones = await this.findActiveSurgeZones();
    let maxMultiplier = 1.0;

    for (const zone of activeZones) {
      try {
        if (isPointInPolygon({ latitude, longitude }, zone.polygon)) {
          if (zone.multiplier > maxMultiplier) {
            maxMultiplier = Number(zone.multiplier);
          }
        }
      } catch (error) {
        this.logger.error(`Error checking surge zone ${zone.id}: ${error.message}`);
      }
    }

    return maxMultiplier;
  }

  async create(surgeZone: CreateSurgeZoneParams): Promise<SurgeZone> {
    this.logger.log(`Creating surge zone with data: ${JSON.stringify(surgeZone)}`);
    return this.surgeZoneRepository.create(surgeZone);
  }

  async update(id: string, surgeZone: Partial<UpdateSurgeZoneParams>): Promise<SurgeZone> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for update: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Updating surge zone ${id} with data: ${JSON.stringify(surgeZone)}`);
    return this.surgeZoneRepository.update(id, surgeZone);
  }

  async delete(id: string): Promise<void> {
    if (!id || typeof id !== 'string') {
      this.logger.warn(`Invalid id provided for deletion: ${id}`);
      throw new Error('Invalid id provided');
    }
    this.logger.log(`Deleting surge zone with id: ${id}`);
    return this.surgeZoneRepository.delete(id);
  }
}
