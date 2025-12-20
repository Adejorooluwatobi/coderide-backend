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

    if (!token) return false;

    try {
      const secret = this.configService.get('JWT_SECRET') || 'your_super_secret_jwt_key_change_in_production';
      const payload = this.jwtService.verify(token, { secret });
      
      request.user = payload;

      // Check if user has the required role
      return payload.role === this.requiredRole;
    } catch {
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
