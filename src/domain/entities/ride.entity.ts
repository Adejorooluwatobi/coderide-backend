import { BaseEntity } from "./base.entity";
import { Rider } from "./rider.entity";
import { Driver } from "./driver.entity";
import { Payment } from "./payment.entity";
import { Rating } from "./rating.entity";
import { RideTracking } from "./ride-tracking.entity";
import { VehicleCategory } from "../enums/vehicle-category.enum";
import { CancelledBy, RideStatus } from "../enums/ride-status.enum";
import { ApiProperty } from "@nestjs/swagger";


export class Ride extends BaseEntity {
    @ApiProperty()
    riderId: string;

    @ApiProperty()
    rider?: Rider;

    @ApiProperty()
    driverId?: string;

    @ApiProperty()
    driver?: Driver;

    @ApiProperty()
    pickupLatitude: number;

    @ApiProperty()
    pickupLongitude: number;

    @ApiProperty()
    pickupAddress: string;

    @ApiProperty()
    destinationLatitude: number;

    @ApiProperty()
    destinationLongitude: number;

    @ApiProperty()
    destinationAddress: string;

    @ApiProperty()
    status: RideStatus;

    @ApiProperty()
    rideType: VehicleCategory;

    @ApiProperty()
    estimatedDistance?: number;

    @ApiProperty()
    actualDistance?: number;

    @ApiProperty()
    estimatedDuration?: number;

    @ApiProperty()
    actualDuration?: number;

    @ApiProperty()
    estimatedPrice?: number;

    @ApiProperty()
    actualPrice?: number;

    @ApiProperty()
    requestedAt: Date;

    @ApiProperty()
    acceptedAt?: Date;

    @ApiProperty()
    startedAt?: Date;

    @ApiProperty()
    completedAt?: Date;

    @ApiProperty()
    cancelledAt?: Date;

    @ApiProperty()
    cancellationReason?: string;

    @ApiProperty()
    cancelledBy?: CancelledBy;

    @ApiProperty()
    payment?: Payment;

    @ApiProperty()
    ratings?: Rating[];

    @ApiProperty()
    trackingPoints?: RideTracking[];

    constructor(data: Partial<Ride>) {
        super();
        Object.assign(this, data);
    }
}
