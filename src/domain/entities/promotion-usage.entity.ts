import { BaseEntity } from './base.entity';
import { Promotion } from './promotion.entity';
import { Rider } from './rider.entity';
import { Ride } from './ride.entity';

export class PromotionUsage extends BaseEntity {
    promotion: Promotion;
    promotionId: string;
    rider: Rider;
    riderId: string;
    ride: Ride;
    rideId: string;
    discountAmount: number;
    usedAt: Date;

    constructor(data: Partial<PromotionUsage>) {
        super();
        Object.assign(this, data);
    }
}
