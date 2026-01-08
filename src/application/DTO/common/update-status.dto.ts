import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateStatusDto {
  @ApiProperty({ description: 'The new status for the entity' })
  @IsNotEmpty()
  status: any;
}
