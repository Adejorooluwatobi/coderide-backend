import { CreateSurgeZoneParams, UpdateSurgeZoneParams } from '../../utils/type';
import { SurgeZone } from '../entities/surge-zone.entity';

export interface ISurgeZoneRepository {
  findById(id: string): Promise<SurgeZone | null>;
  findAll(): Promise<SurgeZone[]>;
  findActiveSurgeZones(): Promise<SurgeZone[]>;
  create(surgeZone: CreateSurgeZoneParams): Promise<SurgeZone>;
  update(id: string, surgeZone: Partial<UpdateSurgeZoneParams>): Promise<SurgeZone>;
  delete(id: string): Promise<void>;
}
