import { PartialType } from '@nestjs/mapped-types';
import { CreateFareEstimateDto } from './create-fare-estimate.dto';

export class UpdateFareEstimateDto extends PartialType(CreateFareEstimateDto) {}
