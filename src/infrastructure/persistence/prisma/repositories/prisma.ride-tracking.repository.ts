import { Injectable } from '@nestjs/common';
import { IRideTrackingRepository } from '../../../../domain/repositories/ride-tracking.repository.interface';
import { RideTracking } from '../../../../domain/entities/ride-tracking.entity';
import { CreateRideTrackingParams, UpdateRideTrackingParams } from '../../../../utils/type';
import { PrismaService } from '../prisma.service';
import { RideTrackingMapper } from '../../../mappers/ride-tracking.mapper';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaRideTrackingRepository implements IRideTrackingRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<RideTracking | null> {
    const tracking = await this.prisma.rideTracking.findUnique({ where: { id } });
    return tracking ? RideTrackingMapper.toDomain(tracking) : null;
  }

  async findAll(): Promise<RideTracking[]> {
    const trackings = await this.prisma.rideTracking.findMany();
    return trackings.map(RideTrackingMapper.toDomain);
  }

  async findByRideId(rideId: string): Promise<RideTracking[]> {
    const trackings = await this.prisma.rideTracking.findMany({ where: { rideId } });
    return trackings.map(RideTrackingMapper.toDomain);
  }

  async create(params: CreateRideTrackingParams): Promise<RideTracking> {
    const tracking = await this.prisma.rideTracking.create({ data: params as Prisma.RideTrackingUncheckedCreateInput });
    return RideTrackingMapper.toDomain(tracking);
  }

  async update(id: string, params: Partial<UpdateRideTrackingParams>): Promise<RideTracking> {
    const tracking = await this.prisma.rideTracking.update({ where: { id }, data: params as Prisma.RideTrackingUpdateInput });
    return RideTrackingMapper.toDomain(tracking);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.rideTracking.delete({ where: { id } });
  }
}
