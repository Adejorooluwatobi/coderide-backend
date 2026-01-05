import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): Promise<string> {
    // Use IP + User ID for authenticated requests
    const userId = req.user?.sub;
    const ip = req.ip || req.connection.remoteAddress;
    return Promise.resolve(userId ? `${ip}-${userId}` : ip);
  }

  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // Skip rate limiting for health checks
    return request.url === '/health';
  }
}