import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { AdminPermission } from 'src/domain/enums/admin-permision.enum';


export class CreateAdminDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsEnum(AdminPermission)
  @IsNotEmpty()
  permissions: AdminPermission;
}
