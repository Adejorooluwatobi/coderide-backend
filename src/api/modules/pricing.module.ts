import { Module } from '@nestjs/common';
import { PricingService } from '../../domain/services/pricing.service';

@Module({
  providers: [PricingService],
  exports: [PricingService],
})
export class PricingModule {}
