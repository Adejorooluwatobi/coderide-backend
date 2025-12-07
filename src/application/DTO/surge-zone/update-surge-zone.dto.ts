import { PartialType } from '@nestjs/mapped-types';
import { CreateSurgeZoneDto } from './create-surge-zone.dto';

export class UpdateSurgeZoneDto extends PartialType(CreateSurgeZoneDto) {}
