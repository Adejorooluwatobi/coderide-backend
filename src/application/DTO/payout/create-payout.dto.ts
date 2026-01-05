import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { PayoutStatus } from '../../../domain/enums/payout-status.enum';

export class CreatePayoutDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    driverId: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @ApiProperty({ enum: PayoutStatus, default: PayoutStatus.PENDING })
    @IsOptional()
    status?: PayoutStatus;

    @ApiProperty()
    @IsOptional()
    @IsString()
    transferReference?: string;
}
