import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminGuard, UserGuard } from './guards';
import { AdminAccessTokenDto, UserAccessTokenDto } from './dto/access-token.dto';
import { AdminLoginDto, UserLoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/application/DTO/user/create-user.dto';
import { CreateAdminDto } from 'src/application/DTO/admin/create-admin.dto';
import { User } from 'src/shared/common/decorators/user.decorator';
import type { UserPayload } from '../../shared/interfaces/user-payload.interface';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('user/register')
  async registerUser(@Body() registerDto: CreateUserDto): Promise<string> {
    await this.authService.registerUser(registerDto);
    return 'User registered successfully';
  }

  @Post('user/login')
  @HttpCode(HttpStatus.OK)
  async userLogin(@Body() loginDto: UserLoginDto): Promise<UserAccessTokenDto> {
    const token = await this.authService.loginUser(loginDto.email, loginDto.password);
    return { 
      accessToken: token.access_token, 
      isActive: token.user?.isActive || false, 
      displayName: token.user?.name || '',
      role: token.user?.role || 'user'
    };
  }

  @Post('user/logout')
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  async userLogout(@User() user: UserPayload): Promise<string> {
    await this.authService.logoutUser(user.sub);
    return 'User logged out successfully';
  }

  @Post('admin/register')
  async registerAdmin(@Body() registerDto: CreateAdminDto): Promise<string> {
    await this.authService.registerAdmin({
      username: registerDto.username,
      password: registerDto.password,
      permissions: 1
    });
    return 'Admin registered successfully';
  }

  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() loginDto: AdminLoginDto): Promise<AdminAccessTokenDto> {
    const token = await this.authService.loginAdmin(loginDto.username, loginDto.password);
    return {
      accessToken: token.access_token,
      isActive: true,
      displayName: token.admin?.name || '',
      role: token.admin?.role || 'admin',
      permissions: token.admin?.permissions || 0
    };
  }

  @Post('admin/logout')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout admin' })
  @ApiResponse({ status: 200, description: 'Admin logged out successfully' })
  async adminLogout(@User() user: UserPayload): Promise<string> {
    await this.authService.logoutAdmin(user.sub);
    return 'Admin logged out successfully';
  }

}