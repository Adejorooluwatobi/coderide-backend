import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { ReferralStatus } from '../enums/referral-status.enum';
import { ApiProperty } from "@nestjs/swagger";

export class Referral extends BaseEntity {
    @ApiProperty()
    referrer: User;

    @ApiProperty()
    referrerId: string;

    @ApiProperty()
    referred: User;

    @ApiProperty()
    referredId: string;

    @ApiProperty()
    code: string;

    @ApiProperty()
    status: ReferralStatus;

    @ApiProperty()
    rewardAmount?: number;

    @ApiProperty()
    rewardedAt?: Date;

    constructor(data: Partial<Referral>) {
        super();
        Object.assign(this, data);
    }
}
