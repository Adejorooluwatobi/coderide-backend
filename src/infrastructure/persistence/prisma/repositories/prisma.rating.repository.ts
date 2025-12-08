import { Injectable } from '@nestjs/common';
import { IRatingRepository } from '../../../../domain/repositories/rating.repository.interface';
import { Rating } from '../../../../domain/entities/rating.entity';
import { CreateRatingParams, UpdateRatingParams } from '../../../../utils/type';
import { PrismaService } from '../prisma.service';
import { RatingMapper } from '../../../mappers/rating.mapper';
import { Prisma } from '@prisma/client';

@Injectable()
export class PrismaRatingRepository implements IRatingRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Rating | null> {
    const rating = await this.prisma.rating.findUnique({ where: { id } });
    return rating ? RatingMapper.toDomain(rating) : null;
  }

  async findAll(): Promise<Rating[]> {
    const ratings = await this.prisma.rating.findMany();
    return ratings.map(RatingMapper.toDomain);
  }

  async findByRideId(rideId: string): Promise<Rating[]> {
    const ratings = await this.prisma.rating.findMany({ where: { rideId } });
    return ratings.map(RatingMapper.toDomain);
  }

  async findByRateeId(rateeId: string): Promise<Rating[]> {
    const ratings = await this.prisma.rating.findMany({ where: { rateeId } });
    return ratings.map(RatingMapper.toDomain);
  }

  async create(params: CreateRatingParams): Promise<Rating> {
    const rating = await this.prisma.rating.create({ data: params as Prisma.RatingUncheckedCreateInput });
    return RatingMapper.toDomain(rating);
  }

  async update(id: string, params: Partial<UpdateRatingParams>): Promise<Rating> {
    const rating = await this.prisma.rating.update({ where: { id }, data: params as Prisma.RatingUpdateInput });
    return RatingMapper.toDomain(rating);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.rating.delete({ where: { id } });
  }
}
