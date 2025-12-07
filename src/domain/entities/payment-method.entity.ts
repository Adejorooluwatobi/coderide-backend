import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";
import { Rider } from "./rider.entity";
import { PaymentMethodType } from "../enums/payment.enum";

export class PaymentMethod extends BaseEntity {
    userId: string;
    user?: User;
    type: PaymentMethodType;
    cardLast4?: string;
    cardBrand?: string;
    isDefault: boolean;
    paymentGatewayToken: string;
    defaultForRider?: Rider;

    constructor(data: Partial<PaymentMethod>) {
        super();
        Object.assign(this, data);
    }
}
