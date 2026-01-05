import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserType } from '../../../domain/enums/user-type.enum';

@Injectable()
export abstract class BaseUserRoleGuard implements CanActivate {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService,
    private readonly requiredRole: UserType,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      console.log(`BaseUserRoleGuard (${this.requiredRole}): Token is undefined/missing.`);
      return false;
    }

    try {
      const secret = this.configService.get('JWT_SECRET') || 'your_super_secret_jwt_key_change_in_production';
      const payload = this.jwtService.verify(token, { secret });
      
      request.user = payload;
      console.log(`BaseUserRoleGuard: Payload verified. Role in token: ${payload.role}, Required: ${this.requiredRole}`);

      // Check if user has the required role
      const isAllowed = payload.role === this.requiredRole;
      if (!isAllowed) {
        console.log(`BaseUserRoleGuard: Access denied. Token role: ${payload.role}, Required: ${this.requiredRole}`);
      }
      return isAllowed;
    } catch (err) {
      console.log(`BaseUserRoleGuard: Token verification failed: ${err.message}`);
      return false;
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

@Injectable()
export class RiderGuard extends BaseUserRoleGuard {
  constructor(jwtService: JwtService, configService: ConfigService) {
    super(jwtService, configService, UserType.RIDER);
  }
}

@Injectable()
export class DriverGuard extends BaseUserRoleGuard {
  constructor(jwtService: JwtService, configService: ConfigService) {
    super(jwtService, configService, UserType.DRIVER);
  }
}
