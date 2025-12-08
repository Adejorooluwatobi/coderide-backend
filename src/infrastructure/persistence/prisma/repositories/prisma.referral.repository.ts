import { Injectable } from '@nestjs/common';
import { IReferralRepository } from '../../../../domain/repositories/referral.repository.interface';
import { Referral } from '../../../../domain/entities/referral.entity';
import { CreateReferralParams, UpdateReferralParams } from '../../../../utils/type';
import { PrismaService } from '../prisma.service';
import { ReferralMapper } from '../../../mappers/referral.mapper';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaReferralRepository implements IReferralRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Referral | null> {
    const referral = await this.prisma.referral.findUnique({ where: { id } });
    return referral ? ReferralMapper.toDomain(referral) : null;
  }

  async findAll(): Promise<Referral[]> {
    const referrals = await this.prisma.referral.findMany();
    return referrals.map(ReferralMapper.toDomain);
  }

  async findByReferredId(referredId: string): Promise<Referral | null> {
    const referral = await this.prisma.referral.findUnique({ where: { referredId } });
    return referral ? ReferralMapper.toDomain(referral) : null;
  }

  async findByReferrerId(referrerId: string): Promise<Referral[]> {
    const referrals = await this.prisma.referral.findMany({ where: { referrerId } });
    return referrals.map(ReferralMapper.toDomain);
  }

  async findByCode(code: string): Promise<Referral | null> {
    const referral = await this.prisma.referral.findUnique({ where: { code } });
    return referral ? ReferralMapper.toDomain(referral) : null;
  }

  async create(params: CreateReferralParams): Promise<Referral> {
    const referral = await this.prisma.referral.create({ data: params as Prisma.ReferralUncheckedCreateInput });
    return ReferralMapper.toDomain(referral);
  }

  async update(id: string, params: Partial<UpdateReferralParams>): Promise<Referral> {
    const referral = await this.prisma.referral.update({ where: { id }, data: params as Prisma.ReferralUpdateInput });
    return ReferralMapper.toDomain(referral);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.referral.delete({ where: { id } });
  }
}
