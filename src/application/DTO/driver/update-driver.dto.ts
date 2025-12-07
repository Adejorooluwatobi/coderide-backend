import {
  IsString,
  IsOptional,
  IsDateString,
  IsObject,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDriverDto {
  // Fields that a driver can update themselves
  // Both independent and company drivers can use this DTO

  @ApiProperty({ required: false, description: 'Updated license number' })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiProperty({ required: false, description: 'Updated license expiry date' })
  @IsOptional()
  @IsDateString()
  licenseExpiry?: Date;

  @ApiProperty({ required: false, description: 'Updated bank account details for payouts' })
  @IsOptional()
  @IsObject()
  bankAccountDetails?: unknown;

  @ApiProperty({ required: false, description: 'Driver online/offline status' })
  @IsOptional()
  @IsBoolean()
  isOnline?: boolean;

  @ApiProperty({ required: false, description: 'Current latitude' })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ required: false, description: 'Current longitude' })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}
