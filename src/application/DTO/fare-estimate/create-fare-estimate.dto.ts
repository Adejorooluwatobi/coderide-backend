import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { VehicleCategory } from 'src/domain/enums/vehicle-category.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFareEstimateDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  riderId?: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  pickupLatitude: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  pickupLongitude: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  destinationLatitude: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  destinationLongitude: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  estimatedPrice: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  estimatedDistance: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  estimatedDuration: number;

  @ApiProperty()
  @IsEnum(VehicleCategory)
  @IsNotEmpty()
  vehicleCategory: VehicleCategory;
}
