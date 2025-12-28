import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // Add any additional properties specific to updating a user, beyond what's in CreateUserDto
  // For example, if you have a status field that can only be updated by an admin:
  // @IsEnum(UserStatus)
  // @IsOptional()
  // status?: UserStatus;
}