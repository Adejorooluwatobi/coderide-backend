import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../domain/services/user.service';
import { AdminService } from '../../domain/services/admin.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/application/DTO/user/create-user.dto';
import { CreateAdminDto } from 'src/application/DTO/admin/create-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(userData: CreateUserDto) {
    const existingUser = await this.userService.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.userService.create({
      ...userData,
      password: hashedPassword,
    });

    const token = this.generateToken(user.id, user.email, 'user');
    return { user, token };
  }

  async loginUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user.id, user.email, 'user');
    return { userType: user.userType, token };
  }

  async registerAdmin(adminData: CreateAdminDto) {
    const existingAdmin = await this.adminService.findByUsername(adminData.username);
    if (existingAdmin) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    const admin = await this.adminService.create({
      ...adminData,
      password: hashedPassword,
    });

    const token = this.generateToken(admin.id, admin.username, 'admin');
    return { admin, token };
  }

  async loginAdmin(username: string, password: string) {
    const admin = await this.adminService.findByUsername(username);
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(admin.id, admin.username, 'admin');
    return { admin, token };
  }

  private generateToken(id: string, identifier: string, role: string): string {
    const payload = { sub: id, email: identifier, role };
    return this.jwtService.sign(payload);
  }
}
