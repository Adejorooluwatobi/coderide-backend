import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { PaymentMethodType } from 'src/domain/enums/payment.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentMethodDto {
  // userId extracted from JWT token - not in DTO

  @ApiProperty()
  @IsEnum(PaymentMethodType)
  @IsNotEmpty()
  type: PaymentMethodType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cardLast4?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  cardBrand?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  paymentGatewayToken: string;
}
