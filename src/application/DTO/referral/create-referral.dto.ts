import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ReferralStatus } from 'src/domain/enums/referral-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReferralDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  referrerId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  referredId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsEnum(ReferralStatus)
  @IsNotEmpty()
  status: ReferralStatus;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  rewardAmount?: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  rewardedAt?: Date;
}
