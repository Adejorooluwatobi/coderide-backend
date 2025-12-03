import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const sanitizedUrl = req.url.replace(/[\r\n]/g, '');
    console.log(`[${new Date().toISOString()}] ${req.method} ${sanitizedUrl}`);
    next();
  }
}