import { BaseEntity } from './base.entity';
import { Vehicle } from './vehicle.entity';
import { Driver } from './driver.entity';
import { ApiProperty } from '@nestjs/swagger';

export class VehicleAssignment extends BaseEntity {
    @ApiProperty()
    vehicle: Vehicle;

    @ApiProperty()
    vehicleId: string;

    @ApiProperty()
    driver: Driver;

    @ApiProperty()
    driverId: string;

    @ApiProperty()
    assignedAt: Date;

    @ApiProperty()
    returnedAt?: Date;

    @ApiProperty()
    startMileage?: number;

    @ApiProperty()
    endMileage?: number;

    @ApiProperty()
    fuelLevelStart?: number;

    @ApiProperty()
    fuelLevelEnd?: number;

    @ApiProperty()
    notes?: string;

    constructor(data: Partial<VehicleAssignment>) {
        super();
        Object.assign(this, data);
    }
}
