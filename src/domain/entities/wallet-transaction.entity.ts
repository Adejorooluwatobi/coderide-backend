import { BaseEntity } from "./base.entity";
import { Wallet } from "./wallet.entity";
import { TransactionType, TransactionCategory, TransactionStatus } from "../enums/wallet-transaction.enum";
import { ApiProperty } from "@nestjs/swagger";

export class WalletTransaction extends BaseEntity {
    @ApiProperty()
    walletId: string;

    @ApiProperty()
    amount: number;

    @ApiProperty({ enum: TransactionType })
    type: TransactionType;

    @ApiProperty({ enum: TransactionCategory })
    category: TransactionCategory;

    @ApiProperty({ enum: TransactionStatus })
    status: TransactionStatus;

    @ApiProperty()
    reference?: string;

    @ApiProperty()
    description?: string;

    @ApiProperty({ type: () => Wallet })
    wallet?: Wallet;

    constructor(data: Partial<WalletTransaction>) {
        super();
        Object.assign(this, data);
    }
}
