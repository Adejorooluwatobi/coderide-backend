import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSurgeZoneDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  polygon: any;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  multiplier: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  startTime: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  endTime?: Date;
}
