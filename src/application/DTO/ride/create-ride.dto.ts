import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { VehicleCategory } from 'src/domain/enums/vehicle-category.enum';
import { CancelledBy, RideStatus } from 'src/domain/enums/ride-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRideDto {
  // riderId extracted from JWT token - not in DTO
  // Rider provides only: pickup, destination, and vehicle type

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  pickupLatitude: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  pickupLongitude: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pickupAddress: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  destinationLatitude: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  destinationLongitude: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  destinationAddress: string;

  @ApiProperty()
  @IsEnum(VehicleCategory)
  @IsNotEmpty()
  rideType: VehicleCategory;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  promotionCode?: string; // Optional promo code
}
