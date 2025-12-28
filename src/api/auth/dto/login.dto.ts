import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
  @IsEmail()
  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class AdminLoginDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

