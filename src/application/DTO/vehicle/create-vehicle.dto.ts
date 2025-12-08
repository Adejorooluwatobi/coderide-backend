import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsDateString,
  IsArray,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { VehicleCategory } from 'src/domain/enums/vehicle-category.enum';
import { VehicleOwnership } from 'src/domain/enums/vehicle-ownership.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({ enum: VehicleOwnership })
  @IsEnum(VehicleOwnership)
  @IsNotEmpty()
  ownershipType: VehicleOwnership;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ownerId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  make: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty()
  @IsEnum(VehicleCategory)
  @IsNotEmpty()
  category: VehicleCategory;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  seats: number;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  insuranceExpiry: Date;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  vehiclePhotos: string[];

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
