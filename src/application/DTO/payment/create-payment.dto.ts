import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { PaymentStatus, PaymentType } from 'src/domain/enums/payment.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  rideId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  riderId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsEnum(PaymentType)
  @IsNotEmpty()
  paymentMethod: PaymentType;

  @ApiProperty()
  @IsEnum(PaymentStatus)
  @IsNotEmpty()
  paymentStatus: PaymentStatus;

  @ApiProperty()
  @IsOptional()
  @IsString()
  transactionReference?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  paidAt?: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currency: string;
}
