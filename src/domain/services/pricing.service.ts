import { Injectable, Logger } from '@nestjs/common';
import { VehicleCategory } from '../enums/vehicle-category.enum';

@Injectable()
export class PricingService {
  private readonly logger = new Logger(PricingService.name);

  // Base rates in NGN
  private readonly BASE_FARES = {
    [VehicleCategory.ECONOMY]: 500,
    [VehicleCategory.COMFORT]: 800,
    [VehicleCategory.PREMIUM]: 1500,
  };

  private readonly PER_KM_RATES = {
    [VehicleCategory.ECONOMY]: 100,
    [VehicleCategory.COMFORT]: 150,
    [VehicleCategory.PREMIUM]: 300,
  };

  private readonly PER_MIN_RATES = {
    [VehicleCategory.ECONOMY]: 20,
    [VehicleCategory.COMFORT]: 30,
    [VehicleCategory.PREMIUM]: 50,
  };

  calculatePrice(
    distanceKm: number,
    durationMin: number,
    category: VehicleCategory,
    multiplier: number = 1.0,
  ): number {
    this.logger.debug(
      `Calculating price for dist=${distanceKm}km, dur=${durationMin}min, cat=${category}, mult=${multiplier}`,
    );

    const baseFare = this.BASE_FARES[category] || this.BASE_FARES[VehicleCategory.ECONOMY];
    const distanceCost = distanceKm * (this.PER_KM_RATES[category] || this.PER_KM_RATES[VehicleCategory.ECONOMY]);
    const timeCost = durationMin * (this.PER_MIN_RATES[category] || this.PER_MIN_RATES[VehicleCategory.ECONOMY]);

    let total = (baseFare + distanceCost + timeCost) * multiplier;

    // Round to nearest 50 or 100
    total = Math.ceil(total / 50) * 50;
    
    // Minimum fare check
    if (total < baseFare) {
        total = baseFare;
    }

    return total;
  }
}
