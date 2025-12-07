import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsObject,
  IsEnum,
} from 'class-validator';
import { DocumentStatus } from 'src/domain/enums/document-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDriverDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  licenseNumber: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  licenseExpiry: Date;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  totalRides: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  totalEarnings: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isOnline: boolean;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty()
  @IsEnum(DocumentStatus)
  @IsNotEmpty()
  documentStatus: DocumentStatus;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  bankAccountDetails?: unknown;
}
