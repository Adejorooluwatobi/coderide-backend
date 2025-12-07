import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsObject,
  IsEnum,
} from 'class-validator';
import { DocumentStatus } from 'src/domain/enums/document-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDriverDto {
  // This is for COMPANY-EMPLOYED drivers (admin creates account)
  // Admin provides userId after in-person verification
  // Status will be set to APPROVED immediately

  @ApiProperty({ description: 'User ID of the employee' })
  @IsString()
  @IsNotEmpty()
  userId: string;

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

  @ApiProperty({ description: 'Document verification status', required: false })
  @IsOptional()
  @IsEnum(DocumentStatus)
  documentStatus?: DocumentStatus;

  @ApiProperty({ description: 'Initial latitude for driver location', required: false })
  @IsOptional()
  latitude?: number;

  @ApiProperty({ description: 'Initial longitude for driver location', required: false })
  @IsOptional()
  longitude?: number;
}
