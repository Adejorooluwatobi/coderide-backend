import {
  IsString,
  IsEmail,
  IsBoolean,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { AdminPermission } from 'src/domain/enums/admin-permision.enum';
import { UserType } from 'src/domain/enums/user-type.enum';
import { ApiProperty } from '@nestjs/swagger';


// ============================================
// User Secure Response DTOs
// ============================================

export class SecureUserResponseDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiProperty({ enum: UserType })
  @IsEnum(UserType)
  userType: UserType;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsBoolean()
  isVerified: boolean;

  @ApiProperty()
  @IsDateString()
  createdAt: Date;

  @ApiProperty()
  @IsDateString()
  updatedAt: Date;
}

// ============================================
// Admin Secure Response DTOs
// ============================================

export class SecureAdminResponseDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty({ enum: AdminPermission })
  @IsEnum(AdminPermission)
  permissions: AdminPermission;

  @ApiProperty()
  @IsDateString()
  createdAt: Date;

  @ApiProperty()
  @IsDateString()
  updatedAt: Date;
}

export class ApiResponseDto<T> {
  @ApiProperty()
  @IsBoolean()
  succeeded: boolean;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty({ required: false })
  @IsOptional()
  data?: T;
}