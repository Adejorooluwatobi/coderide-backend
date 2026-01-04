import { BaseEntity } from "./base.entity";
import { Ride } from "./ride.entity";
import { User } from "./user.entity";
import { RaterType } from "../enums/rating.enum";
import { ApiProperty } from "@nestjs/swagger";

export class Rating extends BaseEntity {
    @ApiProperty()
    rideId: string;

    @ApiProperty()
    ride?: Ride;

    @ApiProperty()
    raterId: string;

    @ApiProperty()
    rater?: User;

    @ApiProperty()
    rateeId: string;

    @ApiProperty()
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
