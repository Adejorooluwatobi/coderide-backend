import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserLoginDto, AdminLoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/application/DTO/user/create-user.dto';
import { CreateAdminDto } from 'src/application/DTO/admin/create-admin.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('user/register')
  @ApiOperation({ summary: 'Register new user' })
  async registerUser(@Body(new ValidationPipe()) userData: CreateUserDto) {
    const result = await this.authService.registerUser(userData);
    return {
      succeeded: true,
      message: 'User registered successfully',
      resultData: {
        user: result.user,
        token: result.token,
      },
    };
  }

  @Post('user/login')
  @ApiOperation({ summary: 'User login' })
  async loginUser(@Body(new ValidationPipe()) loginDto: UserLoginDto) {
    const result = await this.authService.loginUser(loginDto.email, loginDto.password);
    return {
      succeeded: true,
      message: 'Login successful',
      resultData: {
        userType: result.userType,
        token: result.token,
      },
    };
  }

  @Post('admin/register')
  @ApiOperation({ summary: 'Register new admin' })
  async registerAdmin(@Body(new ValidationPipe()) adminData: CreateAdminDto) {
    const result = await this.authService.registerAdmin(adminData);
    return {
      succeeded: true,
      message: 'Admin registered successfully',
      resultData: {
        admin: result.admin,
        token: result.token,
      },
    };
  }

  @Post('admin/login')
  @ApiOperation({ summary: 'Admin login' })
  async loginAdmin(@Body(new ValidationPipe()) loginDto: AdminLoginDto) {
    const result = await this.authService.loginAdmin(loginDto.username, loginDto.password);
    return {
      succeeded: true,
      message: 'Login successful',
      resultData: {
        admin: result.admin,
        token: result.token,
      },
    };
  }
}
