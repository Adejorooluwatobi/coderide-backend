import {
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChatType } from 'src/domain/enums/chat.enum';

export class CreateChatDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  rideId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  riderId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  driverId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  adminId?: string;

  @ApiProperty({ enum: ChatType, default: ChatType.RIDE })
  @IsEnum(ChatType)
  @IsOptional()
  type?: ChatType;
}
