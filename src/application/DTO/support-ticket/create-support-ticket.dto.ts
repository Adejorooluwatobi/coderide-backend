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
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
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

  @ApiProperty()
  @IsEnum(TicketStatus)
  @IsNotEmpty()
  status: TicketStatus;

  @ApiProperty()
  @IsEnum(Priority)
  @IsNotEmpty()
  priority: Priority;

  @ApiProperty()
  @IsOptional()
  @IsString()
  adminId?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  resolvedAt?: Date;
}
