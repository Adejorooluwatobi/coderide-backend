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
  // Used when a new user signs up with a referral code
  // referredId extracted from JWT token (the new user)
  // referrerId looked up from the code

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string; // The referral code provided by existing user
}
