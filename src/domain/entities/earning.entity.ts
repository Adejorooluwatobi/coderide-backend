import { BaseEntity } from './base.entity';
import { Driver } from './driver.entity';
import { Ride } from './ride.entity';
import { PayoutStatus } from '../enums/payout-status.enum';

export class Earning extends BaseEntity {
    driver: Driver;
    driverId: string;
    ride: Ride;
    rideId: string;
    grossAmount: number;
    platformFee: number;
    netAmount: number;
    payoutStatus: PayoutStatus;
    paidOutAt?: Date;

    constructor(data: Partial<Earning>) {
        super();
        Object.assign(this, data);
    }
}
