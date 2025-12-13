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


// ============================================
// User Secure Response DTOs
// ============================================

export class SecureUserResponseDto {
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsEnum(UserType)
  userType: UserType;

  @IsBoolean()
  isActive: boolean;

  @IsBoolean()
  isVerified: boolean;

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}

// ============================================
// Admin Secure Response DTOs
// ============================================

export class SecureAdminResponseDto {
  @IsString()
  id: string;

  @IsString()
  username: string;

  @IsEnum(AdminPermission)
  permissions: AdminPermission;

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}

export class ApiResponseDto<T> {
  @IsBoolean()
  succeeded: boolean;

  @IsString()
  message: string;

  @IsOptional()
  data?: T;
}