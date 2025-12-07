import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDriverApplicationDto {
  // userId extracted from JWT token - not in DTO
  // This is for INDEPENDENT drivers who own their vehicles (self-service)
  // Status will be set to PENDING for admin review

  @ApiProperty({ description: 'Driver license number' })
  @IsString()
  @IsNotEmpty()
  licenseNumber: string;

  @ApiProperty({ description: 'License expiry date' })
  @IsDateString()
  @IsNotEmpty()
  licenseExpiry: Date;

  @ApiProperty({ description: 'Bank account details for payouts', required: false })
  @IsOptional()
  @IsObject()
  bankAccountDetails?: unknown;

  @ApiProperty({ description: 'URL to uploaded driver license photo' })
  @IsString()
  @IsNotEmpty()
  driversLicenseUrl: string;

  @ApiProperty({ description: 'URL to uploaded profile photo' })
  @IsString()
  @IsNotEmpty()
  profilePhotoUrl: string;

  @ApiProperty({ description: 'URL to uploaded vehicle registration', required: false })
  @IsOptional()
  @IsString()
  vehicleRegistrationUrl?: string;

  @ApiProperty({ description: 'URL to uploaded insurance document', required: false })
  @IsOptional()
  @IsString()
  insuranceUrl?: string;

  @ApiProperty({ description: 'URL to uploaded background check', required: false })
  @IsOptional()
  @IsString()
  backgroundCheckUrl?: string;
}
