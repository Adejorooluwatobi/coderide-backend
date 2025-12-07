import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePromotionUsageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  promotionId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  riderId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  rideId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  discountAmount: number;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  usedAt: Date;
}
