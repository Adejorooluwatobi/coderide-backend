import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      console.log('UserGuard: Token is missing from the request headers.');
      return false;
    }
    
    try {
      const secret = this.configService.get('JWT_SECRET') || 'your_super_secret_jwt_key_change_in_production';
      const payload = this.jwtService.verify(token, { secret });
      request.user = payload;
      
      const isAllowed = payload.role === 'RIDER' || payload.role === 'DRIVER';
      if (!isAllowed) {
        console.log(`UserGuard: Access denied for role ${payload.role}. Expected RIDER or DRIVER.`);
      }
      return isAllowed;
    } catch (err) {
      const decoded = this.jwtService.decode(token) as any;
      const now = Math.floor(Date.now() / 1000);
      console.log(`UserGuard: Verification failed: ${err.message}`);
      if (decoded && decoded.exp) {
        console.log(`UserGuard: Token expired at: ${new Date(decoded.exp * 1000).toISOString()}`);
        console.log(`UserGuard: Current server time: ${new Date().toISOString()}`);
        console.log(`UserGuard: Token age (sec): ${now - decoded.iat}`);
      }
      return false;
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}