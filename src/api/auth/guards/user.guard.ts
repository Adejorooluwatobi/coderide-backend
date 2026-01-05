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
      // console.log(`UserGuard: Using secret: ${secret.substring(0, 5)}...`);
      const payload = this.jwtService.verify(token, { secret });
      console.log(`UserGuard: Payload verified: ${JSON.stringify(payload)}`);
      // Assign user to request object
      request.user = payload;
      // Allow access if user is RIDER or DRIVER
      const isAllowed = payload.role === 'RIDER' || payload.role === 'DRIVER';
      if (!isAllowed) {
        console.log(`UserGuard: Access denied for role ${payload.role}. Expected RIDER or DRIVER.`);
      }
      return isAllowed;
    } catch (err) {
      console.log(`UserGuard: Verification failed for token ${token.substring(0, 10)}...: ${err.message}`);
      return false;
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}