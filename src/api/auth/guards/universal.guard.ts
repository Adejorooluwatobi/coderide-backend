import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UniversalGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) return false;
    try {
      const payload = this.jwtService.verify(token);
      // Allow access if any valid role
      return (
        payload.role === 'user' ||
        payload.role === 'admin'
      );
    } catch {
      return false;
    }
  }

  private extractTokenFromHeader(request: { headers?: { authorization?: string } }): string | undefined {
    const [type, token] = request.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}