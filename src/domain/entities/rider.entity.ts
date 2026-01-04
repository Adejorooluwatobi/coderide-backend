import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";
import { PaymentMethod } from "./payment-method.entity";
import { Ride } from "./ride.entity";
import { Payment } from "./payment.entity";
import { ApiProperty } from "@nestjs/swagger";

export class Rider extends BaseEntity {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    user?: User;

    @ApiProperty()
    rating?: number;

    @ApiProperty()
    totalRides?: number;

    @ApiProperty()
    defaultPaymentMethodId?: string;

    @ApiProperty()
    defaultPaymentMethod?: PaymentMethod;

    @ApiProperty()
    preferredLanguage?: string;

    @ApiProperty()
    savedLocations?: any; // JSON

    @ApiProperty()
    rides?: Ride[];

    @ApiProperty()
    payments?: Payment[];

    constructor(data: Partial<Rider>) {
        super();
        Object.assign(this, data);
    }
}