import { PartialType } from '@nestjs/mapped-types';
import { CreateRideTrackingDto } from './create-ride-tracking.dto';

export class UpdateRideTrackingDto extends PartialType(CreateRideTrackingDto) {}
