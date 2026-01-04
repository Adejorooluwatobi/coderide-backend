import { BaseEntity } from "./base.entity";
import { Ride } from "./ride.entity";
import { User } from "./user.entity";
import { RaterType } from "../enums/rating.enum";
import { ApiProperty } from "@nestjs/swagger";

export class Rating extends BaseEntity {
    @ApiProperty()
    rideId: string;

    @ApiProperty({ type: () => Ride })
    ride?: Ride;

    @ApiProperty()
    raterId: string;

    @ApiProperty({ type: () => User })
    rater?: User;

    @ApiProperty()
    rateeId: string;

    @ApiProperty({ type: () => User })
    ratee?: User;

    @ApiProperty()
    rating: number;

    @ApiProperty()
    comment?: string;

    @ApiProperty()
    raterType: RaterType;

    constructor(data: Partial<Rating>) {
        super();
        Object.assign(this, data);
    }
}
