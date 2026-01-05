import { PaymentStatus, PaymentType } from "../enums/payment.enum";
import { BaseEntity } from "./base.entity";
import { Ride } from "./ride.entity";
import { Rider } from "./rider.entity";
import { ApiProperty } from "@nestjs/swagger";

export class Payment extends BaseEntity {
    @ApiProperty()
    rideId: string;

    @ApiProperty({ type: () => Ride })
    ride?: Ride;

    @ApiProperty()
    riderId: string;

    @ApiProperty({ type: () => Rider })
    rider?: Rider;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    paymentMethod: PaymentType;

    @ApiProperty()
    paymentStatus: PaymentStatus;

    @ApiProperty()
    transactionReference?: string;

    @ApiProperty()
    paidAt?: Date;

    @ApiProperty()
    currency: string;

    constructor(data: Partial<Payment>) {
        super();
        Object.assign(this, data);
    }
}
