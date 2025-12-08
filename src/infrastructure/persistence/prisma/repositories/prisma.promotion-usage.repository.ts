import { Injectable } from '@nestjs/common';
import { IPromotionUsageRepository } from '../../../../domain/repositories/promotion-usage.repository.interface';
import { PromotionUsage } from '../../../../domain/entities/promotion-usage.entity';
import { CreatePromotionUsageParams, UpdatePromotionUsageParams } from '../../../../utils/type';
import { PrismaService } from '../prisma.service';
import { PromotionUsageMapper } from '../../../mappers/promotion-usage.mapper';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaPromotionUsageRepository implements IPromotionUsageRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<PromotionUsage | null> {
    const usage = await this.prisma.promotionUsage.findUnique({ where: { id } });
    return usage ? PromotionUsageMapper.toDomain(usage) : null;
  }

  async findAll(): Promise<PromotionUsage[]> {
    const usages = await this.prisma.promotionUsage.findMany();
    return usages.map(PromotionUsageMapper.toDomain);
  }

  async findByPromotionId(promotionId: string): Promise<PromotionUsage[]> {
    const usages = await this.prisma.promotionUsage.findMany({ where: { promotionId } });
    return usages.map(PromotionUsageMapper.toDomain);
  }

  async findByRiderId(riderId: string): Promise<PromotionUsage[]> {
    const usages = await this.prisma.promotionUsage.findMany({ where: { riderId } });
    return usages.map(PromotionUsageMapper.toDomain);
  }

  async create(params: CreatePromotionUsageParams): Promise<PromotionUsage> {
    const usage = await this.prisma.promotionUsage.create({ data: params as Prisma.PromotionUsageUncheckedCreateInput });
    return PromotionUsageMapper.toDomain(usage);
  }

  async update(id: string, params: Partial<UpdatePromotionUsageParams>): Promise<PromotionUsage> {
    const usage = await this.prisma.promotionUsage.update({ where: { id }, data: params as Prisma.PromotionUsageUpdateInput });
    return PromotionUsageMapper.toDomain(usage);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.promotionUsage.delete({ where: { id } });
  }
}
