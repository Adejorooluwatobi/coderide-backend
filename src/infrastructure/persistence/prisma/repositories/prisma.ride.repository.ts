import { Injectable } from '@nestjs/common';
import { IRideRepository } from '../../../../domain/repositories/ride.repository.interface';
import { Ride } from '../../../../domain/entities/ride.entity';
import { CreateRideParams, UpdateRideParams } from '../../../../utils/type';
import { PrismaService } from '../prisma.service';
import { RideMapper } from '../../../mappers/ride.mapper';
import { Prisma, RideStatus } from '@prisma/client';

@Injectable()
export class PrismaRideRepository implements IRideRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Ride | null> {
    const ride = await this.prisma.ride.findUnique({ where: { id } });
    return ride ? RideMapper.toDomain(ride) : null;
  }

  async findAll(): Promise<Ride[]> {
    const rides = await this.prisma.ride.findMany();
    return rides.map(RideMapper.toDomain);
  }

  async findByRiderId(riderId: string): Promise<Ride[]> {
    const rides = await this.prisma.ride.findMany({ where: { riderId } });
    return rides.map(RideMapper.toDomain);
  }

  async findByDriverId(driverId: string): Promise<Ride[]> {
    const rides = await this.prisma.ride.findMany({ where: { driverId } });
    return rides.map(RideMapper.toDomain);
  }

  async findByStatus(status: string): Promise<Ride[]> {
    const rides = await this.prisma.ride.findMany({ where: { status: status as RideStatus } });
    return rides.map(RideMapper.toDomain);
  }

  async create(params: CreateRideParams): Promise<Ride> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { promotionCode, ...rideData } = params;
    const ride = await this.prisma.ride.create({ data: rideData as Prisma.RideUncheckedCreateInput });
    return RideMapper.toDomain(ride);
  }

  async update(id: string, params: Partial<UpdateRideParams>): Promise<Ride> {
    const ride = await this.prisma.ride.update({ where: { id }, data: params as Prisma.RideUpdateInput });
    return RideMapper.toDomain(ride);
  }

  async updateStatus(id: string, status: string): Promise<Ride> {
    const ride = await this.prisma.ride.update({ where: { id }, data: { status: status as RideStatus } });
    return RideMapper.toDomain(ride);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.ride.delete({ where: { id } });
  }
}
