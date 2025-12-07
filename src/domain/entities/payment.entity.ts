import { PaymentStatus, PaymentType } from "../enums/payment.enum";
import { BaseEntity } from "./base.entity";
import { Ride } from "./ride.entity";
import { Rider } from "./rider.entity";

export class Payment extends BaseEntity {
    rideId: string;
    ride?: Ride;
    riderId: string;
    rider?: Rider;
    amount: number;
    paymentMethod: PaymentType;
    paymentStatus: PaymentStatus;
    transactionReference?: string;
    paidAt?: Date;
    currency: string;

    constructor(data: Partial<Payment>) {
        super();
        Object.assign(this, data);
    }
}
