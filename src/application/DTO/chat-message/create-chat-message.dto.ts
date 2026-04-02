import {
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChatMessageType } from 'src/domain/enums/chat-message-type.enum';

export class CreateChatMessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  chatId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({ enum: ChatMessageType, required: false })
  @IsOptional()
  type?: ChatMessageType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  attachmentUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  fileSize?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  duration?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  senderUserId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  senderAdminId?: string;
}
