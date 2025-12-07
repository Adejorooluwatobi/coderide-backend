import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { DiscountType } from 'src/domain/enums/promotion.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePromotionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsEnum(DiscountType)
  @IsNotEmpty()
  discountType: DiscountType;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  discountValue: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  maxDiscount?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  minRideAmount?: number;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  validFrom: Date;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  validUntil: Date;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  usageLimit: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  usedCount: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
