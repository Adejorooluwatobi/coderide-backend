import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";
import { Rider } from "./rider.entity";
import { PaymentGateway, PaymentMethodType } from "../enums/payment.enum";
import { ApiProperty } from "@nestjs/swagger";

export class PaymentMethod extends BaseEntity {
    @ApiProperty()
    userId: string;

    @ApiProperty({ type: () => User })
    user?: User;

    @ApiProperty()
    type: PaymentMethodType;

    @ApiProperty()
    cardFirst6?: string;

    @ApiProperty()
    cardLast4?: string;

    @ApiProperty()
    cardBrand?: string;

    @ApiProperty()
    isDefault: boolean;

    @ApiProperty()
    paymentGateway: PaymentGateway;

    @ApiProperty()
    paymentGatewayToken?: string;

    @ApiProperty({ type: () => Rider })
    defaultForRider?: Rider;

    constructor(data: Partial<PaymentMethod>) {
        super();
        Object.assign(this, data);
    }
}
