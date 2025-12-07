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
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  riderId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  driverId?: string;

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
  @IsEnum(RideStatus)
  @IsNotEmpty()
  status: RideStatus;

  @ApiProperty()
  @IsEnum(VehicleCategory)
  @IsNotEmpty()
  rideType: VehicleCategory;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  estimatedDistance?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  actualDistance?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  estimatedDuration?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  actualDuration?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  estimatedPrice?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  actualPrice?: number;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  requestedAt: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  acceptedAt?: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  startedAt?: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  completedAt?: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  cancelledAt?: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  cancellationReason?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(CancelledBy)
  cancelledBy?: CancelledBy;
}
