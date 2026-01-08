import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto } from 'src/application/DTO/admin/create-admin.dto';
import { CreateUserDto } from 'src/application/DTO/user/create-user.dto';
import { AdminService } from 'src/domain/services/admin.service';
import { UserService } from 'src/domain/services/user.service';
import { AdminStatus } from 'src/domain/enums/admin-status.enum';

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
    const secret = this.configService.get<string>('JWT_SECRET');
    const isProd = this.configService.get('NODE_ENV') === 'production';

    if (!secret || secret.length < 32) {
      if (isProd) {
        throw new Error('JWT_SECRET must be at least 32 characters long in production');
      }
      this.logger.warn('JWT_SECRET is missing or too short. Using mock secret for development.');
      this.jwtSecret = 'a_very_long_mock_secret_for_development_purposes_only_32_chars';
    } else {
      this.jwtSecret = secret;
    }
  }

  private validatePassword(password: string): void {
    if (password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters long');
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      throw new BadRequestException('Password must contain at least one uppercase letter, one lowercase letter, and one number');
    }
  }

  async hashPassword(password: string): Promise<string> {
    this.validatePassword(password);
    return bcrypt.hash(password, 12);
  }

  async registerUser(userData: CreateUserDto): Promise<void> {
    const existingUser = await this.userService.findByEmail(userData.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
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

      // Automate isActive = true on login
      await this.userService.updateStatus(user.id, true);

      return {
        access_token: accessToken,
        user: {isAdmin: false, isActive: true, name: user.firstName, role: user.userType },
      };
    } catch (error) {
      this.logger.error('User login error', error);
      throw error;
    }
  }

  async registerAdmin(adminData: CreateAdminDto): Promise<void> {
    const existingAdmin = await this.adminService.findByUsername(adminData.username);
    if (existingAdmin) {
      throw new BadRequestException('Admin already exists');
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

      // Automate status = ACTIVE on login
      await this.adminService.updateStatus(admin.id, AdminStatus.ACTIVE);

      return { access_token: accessToken, admin: { isAdmin: true, isActive: true, name: admin.username, role: 'ADMIN', permissions: admin.permissions } };
    } catch (error) {
      this.logger.error('Admin login error', error);
      throw error;
    }
  }

  async logoutUser(userId: string): Promise<void> {
    this.logger.log(`Logging out user: ${userId}`);
    await this.userService.updateStatus(userId, false);
  }

  async logoutAdmin(adminId: string): Promise<void> {
    this.logger.log(`Logging out admin: ${adminId}`);
    await this.adminService.updateStatus(adminId, AdminStatus.INACTIVE);
  }
}