import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    const sanitizedUrl = req.url.replace(/[\r\n]/g, '');
    console.log(`[${new Date().toISOString()}] ${req.method} ${sanitizedUrl}`);
    next();
  }
}
