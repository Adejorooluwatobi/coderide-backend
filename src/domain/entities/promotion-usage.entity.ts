import { BaseEntity } from './base.entity';
import { Promotion } from './promotion.entity';
import { Rider } from './rider.entity';
import { Ride } from './ride.entity';
import { ApiProperty } from "@nestjs/swagger";

export class PromotionUsage extends BaseEntity {
    @ApiProperty()
    promotion: Promotion;

    @ApiProperty()
    promotionId: string;

    @ApiProperty()
    rider: Rider;

    @ApiProperty()
    riderId: string;

    @ApiProperty()
    ride: Ride;

    @ApiProperty()
    rideId: string;

    @ApiProperty()
    discountAmount: number;

    @ApiProperty()
    usedAt: Date;

    constructor(data: Partial<PromotionUsage>) {
        super();
        Object.assign(this, data);
    }
}
