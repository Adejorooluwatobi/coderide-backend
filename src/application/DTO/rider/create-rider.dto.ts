import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRiderDto {

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  totalRides?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  defaultPaymentMethodId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  preferredLanguage?: string;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  savedLocations?: any;
}
