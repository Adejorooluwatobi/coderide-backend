import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { TicketCategory } from 'src/domain/enums/ticket-category.enum';
import { TicketStatus } from 'src/domain/enums/ticket-status.enum';
import { Priority } from 'src/domain/enums/priority.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupportTicketDto {
  // userId extracted from JWT token - not in DTO
  // User provides only: category, subject, description, and optional rideId

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  rideId?: string;

  @ApiProperty()
  @IsEnum(TicketCategory)
  @IsNotEmpty()
  category: TicketCategory;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;
}
