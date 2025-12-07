import { BaseEntity } from "./base.entity";
import { Ride } from "./ride.entity";

export class RideTracking extends BaseEntity {
    rideId: string;
    ride?: Ride;
    latitude: number;
    longitude: number;
    timestamp: Date;
    speed?: number;
    heading?: number;

    constructor(data: Partial<RideTracking>) {
        super();
        Object.assign(this, data);
    }
}
