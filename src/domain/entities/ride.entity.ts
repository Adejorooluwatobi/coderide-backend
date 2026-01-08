import { BaseEntity } from "./base.entity";
import { Rider } from "./rider.entity";
import { Driver } from "./driver.entity";
import { Payment } from "./payment.entity";
import { Rating } from "./rating.entity";
import { RideTracking } from "./ride-tracking.entity";
import { VehicleCategory } from "../enums/vehicle-category.enum";
import { ApiProperty } from "@nestjs/swagger";
import { Chat } from "./chat.entity";
import { CancelledBy, RideStatus } from "../enums/ride-status.enum";


export class Ride extends BaseEntity {
    @ApiProperty()
    riderId: string;

    @ApiProperty({ type: () => Rider })
    rider?: Rider;

    @ApiProperty()
    driverId?: string;

    @ApiProperty({ type: () => Driver })
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

    @ApiProperty({ type: () => Payment })
    payment?: Payment;

    @ApiProperty({ type: () => [Rating] })
    ratings?: Rating[];

    @ApiProperty({ type: () => [RideTracking] })
    trackingPoints?: RideTracking[];

    @ApiProperty({ type: () => Chat })
    chat?: Chat;

    constructor(data: Partial<Ride>) {
        super();
        Object.assign(this, data);
    }
}
