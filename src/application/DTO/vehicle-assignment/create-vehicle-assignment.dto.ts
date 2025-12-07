import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleAssignmentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vehicleId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  driverId: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  assignedAt: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  returnedAt?: Date;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  startMileage?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  endMileage?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  fuelLevelStart?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  fuelLevelEnd?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  notes?: string;
}
