import {
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatMessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  chatId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  senderUserId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  senderAdminId?: string;
}
