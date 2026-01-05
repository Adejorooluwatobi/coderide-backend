import { BaseEntity } from "./base.entity";
import { DiscountType } from "../enums/promotion.enum";
import { ApiProperty } from "@nestjs/swagger";

export class Promotion extends BaseEntity {
    @ApiProperty()
    code: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    discountType: DiscountType;

    @ApiProperty()
    discountValue: number;

    @ApiProperty()
    maxDiscount?: number;

    @ApiProperty()
    minRideAmount?: number;

    @ApiProperty()
    validFrom: Date;

    @ApiProperty()
    validUntil: Date;

    @ApiProperty()
    usageLimit: number;

    @ApiProperty()
    usedCount: number;

    @ApiProperty()
    isActive: boolean;

    constructor(data: Partial<Promotion>) {
        super();
        Object.assign(this, data);
    }
}
