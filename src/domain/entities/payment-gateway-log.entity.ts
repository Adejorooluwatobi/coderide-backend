import { BaseEntity } from "./base.entity";
import { PaymentGateway } from "../enums/payment.enum";
import { ApiProperty } from "@nestjs/swagger";

export class PaymentGatewayLog extends BaseEntity {
    @ApiProperty()
    gateway: PaymentGateway;

    @ApiProperty()
    endpoint: string;

    @ApiProperty()
    requestBody?: any;

    @ApiProperty()
    responseBody?: any;

    @ApiProperty()
    statusCode?: number;

    @ApiProperty()
    transactionRef?: string;

    @ApiProperty()
    paymentId?: string;

    constructor(data: Partial<PaymentGatewayLog>) {
        super();
        Object.assign(this, data);
    }
}
