import { BaseEntity } from "./base.entity";
import { DiscountType } from "../enums/promotion.enum";

export class Promotion extends BaseEntity {
    code: string;
    description: string;
    discountType: DiscountType;
    discountValue: number;
    maxDiscount?: number;
    minRideAmount?: number;
    validFrom: Date;
    validUntil: Date;
    usageLimit: number;
    usedCount: number;
    isActive: boolean;

    constructor(data: Partial<Promotion>) {
        super();
        Object.assign(this, data);
    }
}
