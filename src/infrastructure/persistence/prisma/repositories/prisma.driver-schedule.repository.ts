import { Injectable } from '@nestjs/common';
import { IDriverScheduleRepository } from '../../../../domain/repositories/driver-schedule.repository.interface';
import { DriverSchedule } from '../../../../domain/entities/driver-schedule.entity';
import { Prisma} from '@prisma/client';
import { CreateDriverScheduleParams, UpdateDriverScheduleParams } from '../../../../utils/type';
import { PrismaService } from '../prisma.service';
import { DriverScheduleMapper } from '../../../mappers/driver-schedule.mapper';

@Injectable()
export class PrismaDriverScheduleRepository implements IDriverScheduleRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<DriverSchedule | null> {
    const schedule = await this.prisma.driverSchedule.findUnique({ where: { id } });
    return schedule ? DriverScheduleMapper.toDomain(schedule) : null;
  }

  async findAll(): Promise<DriverSchedule[]> {
    const schedules = await this.prisma.driverSchedule.findMany();
    return schedules.map(DriverScheduleMapper.toDomain);
  }

  async findByDriverId(driverId: string): Promise<DriverSchedule[]> {
    const schedules = await this.prisma.driverSchedule.findMany({ where: { driverId } });
    return schedules.map(DriverScheduleMapper.toDomain);
  }

  async create(params: CreateDriverScheduleParams): Promise<DriverSchedule> {
    const schedule = await this.prisma.driverSchedule.create({ data: params as Prisma.DriverScheduleUncheckedCreateInput });
    return DriverScheduleMapper.toDomain(schedule);
  }

  async update(id: string, params: Partial<UpdateDriverScheduleParams>): Promise<DriverSchedule> {
    const schedule = await this.prisma.driverSchedule.update({ where: { id }, data: params as Prisma.DriverScheduleUpdateInput });
    return DriverScheduleMapper.toDomain(schedule);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.driverSchedule.delete({ where: { id } });
  }
}
