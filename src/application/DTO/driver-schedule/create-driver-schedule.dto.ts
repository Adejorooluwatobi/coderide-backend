import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';

export class CreateDriverScheduleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  driverId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(6)
  dayOfWeek: number; // 0 for Sunday, 6 for Saturday

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  startTime: string; // e.g., "09:00"

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endTime: string; // e.g., "17:00"

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
