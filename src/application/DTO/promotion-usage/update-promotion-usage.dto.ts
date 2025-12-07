import { PartialType } from '@nestjs/mapped-types';
import { CreatePromotionUsageDto } from './create-promotion-usage.dto';

export class UpdatePromotionUsageDto extends PartialType(CreatePromotionUsageDto) {}
