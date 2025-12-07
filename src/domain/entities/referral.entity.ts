import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { ReferralStatus } from '../enums/referral-status.enum';

export class Referral extends BaseEntity {
    referrer: User;
    referrerId: string;
    referred: User;
    referredId: string;
    code: string;
    status: ReferralStatus;
    rewardAmount?: number;
    rewardedAt?: Date;

    constructor(data: Partial<Referral>) {
        super();
        Object.assign(this, data);
    }
}
