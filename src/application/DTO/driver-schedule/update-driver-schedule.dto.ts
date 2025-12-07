import { PartialType } from '@nestjs/mapped-types';
import { CreateDriverScheduleDto } from './create-driver-schedule.dto';

export class UpdateDriverScheduleDto extends PartialType(CreateDriverScheduleDto) {}
