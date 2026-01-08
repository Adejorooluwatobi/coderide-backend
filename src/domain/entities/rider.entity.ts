import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";
import { PaymentMethod } from "./payment-method.entity";
import { Ride } from "./ride.entity";
import { Payment } from "./payment.entity";
import { ApiProperty } from "@nestjs/swagger";
import { RiderStatus } from "../enums/rider-status.enum";

export class Rider extends BaseEntity {
    @ApiProperty()
    userId: string;

    @ApiProperty({ type: () => User })
    user?: User;

    @ApiProperty()
    rating?: number;

    @ApiProperty()
    totalRides?: number;

    @ApiProperty()
    status?: RiderStatus;

    @ApiProperty()
    defaultPaymentMethodId?: string;

    @ApiProperty({ type: () => PaymentMethod })
    defaultPaymentMethod?: PaymentMethod;

    @ApiProperty()
    preferredLanguage?: string;

    @ApiProperty()
    savedLocations?: any; // JSON

    @ApiProperty({ type: () => [Ride] })
    rides?: Ride[];

    @ApiProperty({ type: () => [Payment] })
    payments?: Payment[];

    constructor(data: Partial<Rider>) {
        super();
        Object.assign(this, data);
    }
}