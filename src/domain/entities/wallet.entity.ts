import { BaseEntity } from "./base.entity";
import { User } from "./user.entity";
import { WalletTransaction } from "./wallet-transaction.entity";
import { ApiProperty } from "@nestjs/swagger";

export class Wallet extends BaseEntity {
    @ApiProperty()
    userId?: string;

    @ApiProperty()
    isOrganization: boolean;

    @ApiProperty()
    balance: number; // Decimal in Prisma is string/number in JS

    @ApiProperty()
    currency: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty({ type: () => User })
    user?: User;

    @ApiProperty({ type: () => [WalletTransaction] })
    transactions?: WalletTransaction[];

    constructor(data: Partial<Wallet>) {
        super();
        Object.assign(this, data);
    }
}
