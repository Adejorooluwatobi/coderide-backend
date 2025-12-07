import { BaseEntity } from "./base.entity";
import { Ride } from "./ride.entity";
import { User } from "./user.entity";
import { RaterType } from "../enums/rating.enum";

export class Rating extends BaseEntity {
    rideId: string;
    ride?: Ride;
    raterId: string;
    rater?: User;
    rateeId: string;
    ratee?: User;
    rating: number;
    comment?: string;
    raterType: RaterType;

    constructor(data: Partial<Rating>) {
        super();
        Object.assign(this, data);
    }
}
