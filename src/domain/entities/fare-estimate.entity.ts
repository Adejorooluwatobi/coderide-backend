import { BaseEntity } from './base.entity';
import { VehicleCategory } from '../enums/vehicle-category.enum';
import { ApiProperty } from '@nestjs/swagger';

export class FareEstimate extends BaseEntity {
    @ApiProperty()
    riderId?: string;

    @ApiProperty()
    pickupLatitude: number;

    @ApiProperty()
    pickupLongitude: number;

    @ApiProperty()
    destinationLatitude: number;

    @ApiProperty()
    destinationLongitude: number;

    @ApiProperty()
    estimatedPrice: number;

    @ApiProperty()
    estimatedDistance: number;

    @ApiProperty()
    estimatedDuration: number;

    @ApiProperty()
    vehicleCategory: VehicleCategory;

    constructor(data: Partial<FareEstimate>) {
        super();
        Object.assign(this, data);
    }
}
