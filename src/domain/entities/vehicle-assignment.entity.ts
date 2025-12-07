import { BaseEntity } from './base.entity';
import { Vehicle } from './vehicle.entity';
import { Driver } from './driver.entity';

export class VehicleAssignment extends BaseEntity {
    vehicle: Vehicle;
    vehicleId: string;
    driver: Driver;
    driverId: string;
    assignedAt: Date;
    returnedAt?: Date;
    startMileage?: number;
    endMileage?: number;
    fuelLevelStart?: number;
    fuelLevelEnd?: number;
    notes?: string;

    constructor(data: Partial<VehicleAssignment>) {
        super();
        Object.assign(this, data);
    }
}
