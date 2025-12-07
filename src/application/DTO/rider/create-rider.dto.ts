import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRiderDto {
  // userId extracted from JWT token - not in DTO

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  defaultPaymentMethodId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  preferredLanguage?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  savedLocations?: any;
}
