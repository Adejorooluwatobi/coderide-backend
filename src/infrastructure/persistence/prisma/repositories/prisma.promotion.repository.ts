import { Injectable } from '@nestjs/common';
import { IPromotionRepository } from '../../../../domain/repositories/promotion.repository.interface';
import { Promotion } from '../../../../domain/entities/promotion.entity';
import { CreatePromotionParams, UpdatePromotionParams } from '../../../../utils/type';
import { PrismaService } from '../prisma.service';
import { PromotionMapper } from '../../../mappers/promotion.mapper';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaPromotionRepository implements IPromotionRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Promotion | null> {
    const promotion = await this.prisma.promotion.findUnique({ where: { id } });
    return promotion ? PromotionMapper.toDomain(promotion) : null;
  }

  async findAll(): Promise<Promotion[]> {
    const promotions = await this.prisma.promotion.findMany();
    return promotions.map(PromotionMapper.toDomain);
  }

  async findByCode(code: string): Promise<Promotion | null> {
    const promotion = await this.prisma.promotion.findUnique({ where: { code } });
    return promotion ? PromotionMapper.toDomain(promotion) : null;
  }

  async findActivePromotions(): Promise<Promotion[]> {
    const now = new Date();
    const promotions = await this.prisma.promotion.findMany({
      where: {
        isActive: true,
        validFrom: { lte: now },
        validUntil: { gte: now },
      },
    });
    return promotions.map(PromotionMapper.toDomain);
  }

  async create(params: CreatePromotionParams): Promise<Promotion> {
    const promotion = await this.prisma.promotion.create({ data: params as Prisma.PromotionUncheckedCreateInput });
    return PromotionMapper.toDomain(promotion);
  }

  async update(id: string, params: Partial<UpdatePromotionParams>): Promise<Promotion> {
    const promotion = await this.prisma.promotion.update({ where: { id }, data: params as Prisma.PromotionUpdateInput });
    return PromotionMapper.toDomain(promotion);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.promotion.delete({ where: { id } });
  }
}
