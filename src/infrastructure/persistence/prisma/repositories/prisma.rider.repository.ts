import { Injectable } from '@nestjs/common';
import { IRiderRepository } from '../../../../domain/repositories/rider.repository.interface';
import { Rider } from '../../../../domain/entities/rider.entity';
import { CreateRiderParams, UpdateRiderParams } from '../../../../utils/type';
import { PrismaService } from '../prisma.service';
import { RiderMapper } from '../../../mappers/rider.mapper';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaRiderRepository implements IRiderRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Rider | null> {
    const rider = await this.prisma.rider.findUnique({ where: { id } });
    return rider ? RiderMapper.toDomain(rider) : null;
  }

  async findAll(): Promise<Rider[]> {
    const riders = await this.prisma.rider.findMany();
    return riders.map(RiderMapper.toDomain);
  }

  async findByUserId(userId: string): Promise<Rider | null> {
    const rider = await this.prisma.rider.findUnique({ where: { userId } });
    return rider ? RiderMapper.toDomain(rider) : null;
  }

  async findByDefaultPaymentMethodId(defaultPaymentMethodId: string): Promise<Rider | null> {
    const rider = await this.prisma.rider.findUnique({ where: { defaultPaymentMethodId } });
    return rider ? RiderMapper.toDomain(rider) : null;
  }

  // async create(params: CreateRiderParams): Promise<Rider> {
  //   const data = RiderMapper.toPrisma({ userId: params.userId } as Rider);
  //   const rider = await this.prisma.rider.create({ data });
  //   return RiderMapper.toDomain(rider);
  // }
  async create(params: CreateRiderParams): Promise<Rider> {
    const rider = await this.prisma.rider.create({ data: { userId: params.userId } as Prisma.RiderUncheckedCreateInput });
    return RiderMapper.toDomain(rider);
  }

  async update(id: string, params: Partial<UpdateRiderParams>): Promise<Rider> {
    const rider = await this.prisma.rider.update({ where: { id }, data: params as Prisma.RiderUpdateInput });
    return RiderMapper.toDomain(rider);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.rider.delete({ where: { id } });
  }
}
