import { Injectable } from '@nestjs/common';
import { ISurgeZoneRepository } from '../../../../domain/repositories/surge-zone.repository.interface';
import { SurgeZone } from '../../../../domain/entities/surge-zone.entity';
import { CreateSurgeZoneParams, UpdateSurgeZoneParams } from '../../../../utils/type';
import { PrismaService } from '../prisma.service';
import { SurgeZoneMapper } from '../../../mappers/surge-zone.mapper';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaSurgeZoneRepository implements ISurgeZoneRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<SurgeZone | null> {
    const zone = await this.prisma.surgeZone.findUnique({ where: { id } });
    return zone ? SurgeZoneMapper.toDomain(zone) : null;
  }

  async findAll(): Promise<SurgeZone[]> {
    const zones = await this.prisma.surgeZone.findMany();
    return zones.map(SurgeZoneMapper.toDomain);
  }

  async findActiveSurgeZones(): Promise<SurgeZone[]> {
    const now = new Date();
    const zones = await this.prisma.surgeZone.findMany({
      where: {
        isActive: true,
        startTime: { lte: now },
        OR: [
          { endTime: null },
          { endTime: { gte: now } },
        ],
      },
    });
    return zones.map(SurgeZoneMapper.toDomain);
  }

  async create(params: CreateSurgeZoneParams): Promise<SurgeZone> {
    const zone = await this.prisma.surgeZone.create({ data: params as Prisma.SurgeZoneUncheckedCreateInput });
    return SurgeZoneMapper.toDomain(zone);
  }

  async update(id: string, params: Partial<UpdateSurgeZoneParams>): Promise<SurgeZone> {
    const zone = await this.prisma.surgeZone.update({ where: { id }, data: params as Prisma.SurgeZoneUpdateInput });
    return SurgeZoneMapper.toDomain(zone);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.surgeZone.delete({ where: { id } });
  }
}
