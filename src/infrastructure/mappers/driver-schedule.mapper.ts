import { DriverSchedule as PrismaDriverSchedule } from '@prisma/client';
import { DriverSchedule } from '../../domain/entities/driver-schedule.entity';

export class DriverScheduleMapper {
  static toDomain(prismaSchedule: PrismaDriverSchedule): DriverSchedule {
    return new DriverSchedule({
      id: prismaSchedule.id,
      driverId: prismaSchedule.driverId,
      dayOfWeek: prismaSchedule.dayOfWeek,
      startTime: prismaSchedule.startTime,
      endTime: prismaSchedule.endTime,
      isActive: prismaSchedule.isActive,
      createdAt: prismaSchedule.createdAt,
      updatedAt: prismaSchedule.updatedAt,
    });
  }

  static toPrisma(schedule: DriverSchedule): Omit<PrismaDriverSchedule, 'createdAt' | 'updatedAt'> {
    return {
      id: schedule.id,
      driverId: schedule.driverId,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      isActive: schedule.isActive,
    };
  }
}
