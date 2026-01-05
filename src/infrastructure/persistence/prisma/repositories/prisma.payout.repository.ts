import { Injectable } from '@nestjs/common';
import { IPayoutRepository } from '../../../../domain/repositories/payout.repository.interface';
import { Payout } from '../../../../domain/entities/payout.entity';
import { CreatePayoutParams, UpdatePayoutParams } from '../../../../utils/type';
import { PrismaService } from '../prisma.service';
import { PayoutMapper } from '../../../mappers/payout.mapper';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaPayoutRepository implements IPayoutRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Payout | null> {
    const payout = await this.prisma.payout.findUnique({
      where: { id },
      include: { earnings: true },
    });
    return payout ? PayoutMapper.toDomain(payout) : null;
  }

  async findAll(): Promise<Payout[]> {
    const payouts = await this.prisma.payout.findMany({
      include: { earnings: true },
    });
    return payouts.map(PayoutMapper.toDomain);
  }

  async findByDriverId(driverId: string): Promise<Payout[]> {
    const payouts = await this.prisma.payout.findMany({
      where: { driverId },
      include: { earnings: true },
    });
    return payouts.map(PayoutMapper.toDomain);
  }

  async create(params: CreatePayoutParams): Promise<Payout> {
    const payout = await this.prisma.payout.create({
      data: params as Prisma.PayoutUncheckedCreateInput,
      include: { earnings: true },
    });
    return PayoutMapper.toDomain(payout);
  }

  async update(id: string, params: Partial<UpdatePayoutParams>): Promise<Payout> {
    const payout = await this.prisma.payout.update({
      where: { id },
      data: params as Prisma.PayoutUpdateInput,
      include: { earnings: true },
    });
    return PayoutMapper.toDomain(payout);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.payout.delete({ where: { id } });
  }
}
