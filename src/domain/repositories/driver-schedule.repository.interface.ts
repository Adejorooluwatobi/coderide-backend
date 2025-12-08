import { CreateDriverScheduleParams, UpdateDriverScheduleParams } from '../../utils/type';
import { DriverSchedule } from '../entities/driver-schedule.entity';

export interface IDriverScheduleRepository {
  findById(id: string): Promise<DriverSchedule | null>;
  findAll(): Promise<DriverSchedule[]>;
  findByDriverId(driverId: string): Promise<DriverSchedule[]>;
  create(driverSchedule: CreateDriverScheduleParams): Promise<DriverSchedule>;
  update(id: string, driverSchedule: Partial<UpdateDriverScheduleParams>): Promise<DriverSchedule>;
  delete(id: string): Promise<void>;
}
