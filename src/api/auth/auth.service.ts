import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto } from 'src/application/DTO/admin/create-admin.dto';
import { CreateUserDto } from 'src/application/DTO/user/create-user.dto';
import { AdminService } from 'src/domain/services/admin.service';
import { UserService } from 'src/domain/services/user.service';

interface AuthResponse {
  access_token: string;
  user?: { isAdmin: boolean; isActive: boolean; name: string; role: string };
  admin?: { isAdmin: boolean; isActive: boolean; name: string; role: string; permissions: number };
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtSecret: string;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
    private adminService: AdminService,

  ) {
    this.jwtSecret = this.configService.get('JWT_SECRET') || 'your_super_secret_jwt_key_change_in_production';
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async registerUser(userData: CreateUserDto): Promise<void> {
    const existingUser = await this.userService.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    const hashedPassword = await this.hashPassword(userData.password);
    await this.userService.create({
      ...userData,
      password: hashedPassword,
      isActive: true
    });
  }
  async loginUser(email: string, password: string): Promise<AuthResponse> {
    try {
      const user = await this.userService.findByEmail(email);
      this.logger.log(`User found: ${!!user}, Has password: ${!!user?.password}`);
      
      if (!user) {
        throw new NotFoundException('User not found');
      }
      
      if (!user.password) {
        throw new NotFoundException('User has no password set');
      }
      
      const passwordMatch = await bcrypt.compare(password, user.password);
      this.logger.log(`Password match: ${passwordMatch}`);
      
      if (!passwordMatch) {
        throw new NotFoundException('Invalid password');
      }

      const payload = { sub: user.id, email: user.email, role: user.userType };
      const accessToken = this.jwtService.sign(payload);

      return {
        access_token: accessToken,
        user: {isAdmin: false, isActive: user.isActive, name: user.firstName, role: user.userType },
      };
    } catch (error) {
      this.logger.error('User login error', error);
      throw error;
    }
  }

  async registerAdmin(adminData: CreateAdminDto): Promise<void> {
    const existingAdmin = await this.adminService.findByUsername(adminData.username);
    if (existingAdmin) {
      throw new Error('Admin already exists');
    }
    const hashedPassword = await this.hashPassword(adminData.password);
    await this.adminService.create({
      username: adminData.username,
      password: hashedPassword,
      permissions: adminData.permissions
    });
  }

  async loginAdmin(_username: string, _password: string): Promise<AuthResponse> {
    try {
      const admin = await this.adminService.findByUsername(_username);
      this.logger.log(`Admin found: ${!!admin}, Has password: ${!!admin?.password}`);
      
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }
      
      if (!admin.password) {
        throw new NotFoundException('Admin has no password set');
      }
      
      const passwordMatch = await bcrypt.compare(_password, admin.password);
      this.logger.log(`Password match: ${passwordMatch}`);
      
      if (!passwordMatch) {
        throw new NotFoundException('Invalid password');
      }
      const payload = { sub: admin.id, email: admin.username, role: 'admin', permissions: admin.permissions };
      const accessToken = this.jwtService.sign(payload);
      return { access_token: accessToken, admin: { isAdmin: true, isActive: true, name: admin.username, role: 'ADMIN', permissions: admin.permissions } };
    } catch (error) {
      this.logger.error('Admin login error', error);
      throw error;
    }
  }
}