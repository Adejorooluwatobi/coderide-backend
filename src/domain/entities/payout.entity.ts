import { BaseEntity } from './base.entity';
import { Driver } from './driver.entity';
import { Earning } from './earning.entity';
import { PayoutStatus } from '../enums/payout-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class Payout extends BaseEntity {
    @ApiProperty()
    driver: Driver;

    @ApiProperty()
    driverId: string;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    status: PayoutStatus;

    @ApiProperty()
    transferReference?: string;

    @ApiProperty()
    processedAt?: Date;

    @ApiProperty({ type: () => [Earning] })
    earnings: Earning[];

    constructor(data: Partial<Payout>) {
        super();
        Object.assign(this, data);
    }
}
