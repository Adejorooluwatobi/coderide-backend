import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { PayoutStatus } from 'src/domain/enums/payout-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEarningDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  driverId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  rideId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  grossAmount: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  platformFee: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  netAmount: number;

  @ApiProperty()
  @IsEnum(PayoutStatus)
  @IsNotEmpty()
  payoutStatus: PayoutStatus;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  paidOutAt?: Date;
}
