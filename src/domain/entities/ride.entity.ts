import { BaseEntity } from "./base.entity";
import { Rider } from "./rider.entity";
import { Driver } from "./driver.entity";
import { Payment } from "./payment.entity";
import { Rating } from "./rating.entity";
import { RideTracking } from "./ride-tracking.entity";
import { VehicleCategory } from "../enums/vehicle-category.enum";
import { CancelledBy, RideStatus } from "../enums/ride-status.enum";


export class Ride extends BaseEntity {
    riderId: string;
    rider?: Rider;
    driverId?: string;
    driver?: Driver;
    pickupLatitude: number;
    pickupLongitude: number;
    pickupAddress: string;
    destinationLatitude: number;
    destinationLongitude: number;
    destinationAddress: string;
    status: RideStatus;
    rideType: VehicleCategory;
    estimatedDistance?: number;
    actualDistance?: number;
    estimatedDuration?: number;
    actualDuration?: number;
    estimatedPrice?: number;
    actualPrice?: number;
    requestedAt: Date;
    acceptedAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
    cancellationReason?: string;
    cancelledBy?: CancelledBy;

    payment?: Payment;
    ratings?: Rating[];
    trackingPoints?: RideTracking[];

    constructor(data: Partial<Ride>) {
        super();
        Object.assign(this, data);
    }
}
