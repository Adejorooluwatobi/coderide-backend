import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AdminPermission } from '../../../domain/enums/admin-permision.enum';

@Injectable()
export abstract class BaseAdminPermissionGuard implements CanActivate {
  constructor(
    protected readonly jwtService: JwtService,
    protected readonly configService: ConfigService,
    private readonly requiredPermission: AdminPermission,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) return false;

    try {
      const secret = this.configService.get('JWT_SECRET') || 'your_super_secret_jwt_key_change_in_production';
      const payload = this.jwtService.verify(token, { secret });
      
      request.admin = payload;

      // Check if role is admin (case-insensitive check for safety)
      const role = payload.role?.toLowerCase();
      if (role !== 'admin') {
        return false;
      }

      // Check if permission bit is set
      const userPermissions = payload.permissions || 0;
      return (userPermissions & this.requiredPermission) === this.requiredPermission;
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
export class AdminGuard1 extends BaseAdminPermissionGuard {
  constructor(jwtService: JwtService, configService: ConfigService) {
    super(jwtService, configService, AdminPermission.MANAGE_SYSTEM_SETTINGS);
  }
}

@Injectable()
export class AdminGuard2 extends BaseAdminPermissionGuard {
  constructor(jwtService: JwtService, configService: ConfigService) {
    super(jwtService, configService, AdminPermission.VIEW_REPORTS);
  }
}

@Injectable()
export class AdminGuard4 extends BaseAdminPermissionGuard {
  constructor(jwtService: JwtService, configService: ConfigService) {
    super(jwtService, configService, AdminPermission.MANAGE_DRIVERS);
  }
}

@Injectable()
export class AdminGuard8 extends BaseAdminPermissionGuard {
  constructor(jwtService: JwtService, configService: ConfigService) {
    super(jwtService, configService, AdminPermission.MANAGE_PAYMENTS);
  }
}

@Injectable()
export class AdminGuard16 extends BaseAdminPermissionGuard {
  constructor(jwtService: JwtService, configService: ConfigService) {
    super(jwtService, configService, AdminPermission.MANAGE_RIDES);
  }
}

@Injectable()
export class AdminGuard32 extends BaseAdminPermissionGuard {
  constructor(jwtService: JwtService, configService: ConfigService) {
    super(jwtService, configService, AdminPermission.MANAGE_USERS);
  }
}

@Injectable()
export class AdminGuard64 extends BaseAdminPermissionGuard {
  constructor(jwtService: JwtService, configService: ConfigService) {
    super(jwtService, configService, AdminPermission.MANAGE_PROMOTIONS_COUPONS);
  }
}

@Injectable()
export class AdminGuard128 extends BaseAdminPermissionGuard {
  constructor(jwtService: JwtService, configService: ConfigService) {
    super(jwtService, configService, AdminPermission.MANAGE_SAFETY_INCIDENTS);
  }
}
