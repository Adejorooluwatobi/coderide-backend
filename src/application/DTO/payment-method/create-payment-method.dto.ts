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
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsEnum(PaymentMethodType)
  @IsNotEmpty()
  type: PaymentMethodType;

  @ApiProperty()
  @IsOptional()
  @IsString()
  cardLast4?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  cardBrand?: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isDefault: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  paymentGatewayToken: string;
}
