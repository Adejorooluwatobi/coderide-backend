import { PartialType } from '@nestjs/swagger';
import { CreatePayoutDto } from './create-payout.dto';
import { IsOptional, IsDate } from 'class-validator';

export class UpdatePayoutDto extends PartialType(CreatePayoutDto) {
    @IsOptional()
    @IsDate()
    processedAt?: Date;
}
