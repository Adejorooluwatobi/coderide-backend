import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRideTrackingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  rideId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  timestamp: Date;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  speed?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  heading?: number;
}
