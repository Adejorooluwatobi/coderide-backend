import { BaseEntity } from './base.entity';
import { VehicleCategory } from '../enums/vehicle-category.enum';

export class FareEstimate extends BaseEntity {
    riderId?: string;
    pickupLatitude: number;
    pickupLongitude: number;
    destinationLatitude: number;
    destinationLongitude: number;
    estimatedPrice: number;
    estimatedDistance: number;
    estimatedDuration: number;
    vehicleCategory: VehicleCategory;

    constructor(data: Partial<FareEstimate>) {
        super();
        Object.assign(this, data);
    }
}
