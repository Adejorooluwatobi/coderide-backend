import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "./base.entity";
import { Ride } from "./ride.entity";

export class RideTracking extends BaseEntity {
    @ApiProperty()
    rideId: string;

    @ApiProperty({ type: () => Ride })
    ride?: Ride;

    @ApiProperty()
    latitude: number;

    @ApiProperty()
    longitude: number;

    @ApiProperty()
    timestamp: Date;

    @ApiProperty()
    speed?: number;

    @ApiProperty()
    heading?: number;

    constructor(data: Partial<RideTracking>) {
        super();
        Object.assign(this, data);
    }
}
