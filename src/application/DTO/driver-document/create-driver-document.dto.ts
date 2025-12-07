import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { DocumentType } from 'src/domain/enums/document-type.enum';
import { DocumentStatus } from 'src/domain/enums/document-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDriverDocumentDto {
  @ApiProperty()  
  @IsString()
  @IsNotEmpty()
  driverId: string;

  @ApiProperty()
  @IsEnum(DocumentType)
  @IsNotEmpty()
  documentType: DocumentType;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  documentUrl: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  documentNumber?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  expiryDate?: Date;

  @ApiProperty()
  @IsEnum(DocumentStatus)
  @IsNotEmpty()
  status: DocumentStatus;

  @ApiProperty()
  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  uploadedAt: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  verifiedAt?: Date;
}
