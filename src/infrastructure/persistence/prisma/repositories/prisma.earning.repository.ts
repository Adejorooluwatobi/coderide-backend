import { Injectable } from '@nestjs/common';
import { IEarningRepository } from '../../../../domain/repositories/earning.repository.interface';
import { Earning } from '../../../../domain/entities/earning.entity';
import { Prisma } from '@prisma/client';
import { CreateEarningParams, UpdateEarningParams } from '../../../../utils/type';
import { PrismaService } from '../prisma.service';
import { EarningMapper } from '../../../mappers/earning.mapper';

@Injectable()
export class PrismaEarningRepository implements IEarningRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Earning | null> {
    const earning = await this.prisma.earning.findUnique({ where: { id } });
    return earning ? EarningMapper.toDomain(earning) : null;
  }

  async findAll(): Promise<Earning[]> {
    const earnings = await this.prisma.earning.findMany();
    return earnings.map(EarningMapper.toDomain);
  }

  async findByRideId(rideId: string): Promise<Earning | null> {
    const earning = await this.prisma.earning.findUnique({ where: { rideId } });
    return earning ? EarningMapper.toDomain(earning) : null;
  }

  async findByDriverId(driverId: string): Promise<Earning[]> {
    const earnings = await this.prisma.earning.findMany({ where: { driverId } });
    return earnings.map(EarningMapper.toDomain);
  }

  async create(params: CreateEarningParams): Promise<Earning> {
    const earning = await this.prisma.earning.create({ data: params as Prisma.EarningUncheckedCreateInput });
    return EarningMapper.toDomain(earning);
  }

  async update(id: string, params: Partial<UpdateEarningParams>): Promise<Earning> {
    const earning = await this.prisma.earning.update({ where: { id }, data: params as Prisma.EarningUpdateInput });
    return EarningMapper.toDomain(earning);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.earning.delete({ where: { id } });
  }
}
