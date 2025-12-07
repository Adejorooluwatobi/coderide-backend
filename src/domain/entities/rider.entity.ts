import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";
import { PaymentMethod } from "./payment-method.entity";
import { Ride } from "./ride.entity";
import { Payment } from "./payment.entity";

export class Rider extends BaseEntity {
    userId: string;
    user?: User;
    rating?: number;
    totalRides?: number;
    defaultPaymentMethodId?: string;
    defaultPaymentMethod?: PaymentMethod;
    preferredLanguage?: string;
    savedLocations?: any; // JSON
    
    rides?: Ride[];
    payments?: Payment[];

    constructor(data: Partial<Rider>) {
        super();
        Object.assign(this, data);
    }
}