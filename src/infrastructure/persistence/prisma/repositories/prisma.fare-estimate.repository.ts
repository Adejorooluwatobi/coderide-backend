import { Injectable } from '@nestjs/common';
import { IFareEstimateRepository } from '../../../../domain/repositories/fare-estimate.repository.interface';
import { FareEstimate } from '../../../../domain/entities/fare-estimate.entity';
import { CreateFareEstimateParams, UpdateFareEstimateParams } from '../../../../utils/type';
import { PrismaService } from '../prisma.service';
import { FareEstimateMapper } from '../../../mappers/fare-estimate.mapper';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaFareEstimateRepository implements IFareEstimateRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<FareEstimate | null> {
    const estimate = await this.prisma.fareEstimate.findUnique({ where: { id } });
    return estimate ? FareEstimateMapper.toDomain(estimate) : null;
  }

  async findAll(): Promise<FareEstimate[]> {
    const estimates = await this.prisma.fareEstimate.findMany();
    return estimates.map(FareEstimateMapper.toDomain);
  }

  async findByRiderId(riderId: string): Promise<FareEstimate[]> {
    const estimates = await this.prisma.fareEstimate.findMany({ where: { riderId } });
    return estimates.map(FareEstimateMapper.toDomain);
  }

  async create(params: CreateFareEstimateParams): Promise<FareEstimate> {
    const estimate = await this.prisma.fareEstimate.create({ data: params as Prisma.FareEstimateUncheckedCreateInput });
    return FareEstimateMapper.toDomain(estimate);
  }

  async update(id: string, params: Partial<UpdateFareEstimateParams>): Promise<FareEstimate> {
    const estimate = await this.prisma.fareEstimate.update({ where: { id }, data: params as Prisma.FareEstimateUpdateInput });
    return FareEstimateMapper.toDomain(estimate);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.fareEstimate.delete({ where: { id } });
  }
}
