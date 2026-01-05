import { BaseEntity } from './base.entity';
import { Driver } from './driver.entity';
import { Ride } from './ride.entity';
import { PayoutStatus } from '../enums/payout-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class Earning extends BaseEntity {
    @ApiProperty()
    driver: Driver;

    @ApiProperty()
    driverId: string;

    @ApiProperty()
    ride: Ride;

    @ApiProperty()
    rideId: string;

    @ApiProperty()
    grossAmount: number;

    @ApiProperty()
    platformFee: number;

    @ApiProperty()
    netAmount: number;

    @ApiProperty()
    payoutStatus: PayoutStatus;

    @ApiProperty()
    paidOutAt?: Date;

    @ApiProperty()
    payoutId?: string;

    constructor(data: Partial<Earning>) {
        super();
        Object.assign(this, data);
    }
}
