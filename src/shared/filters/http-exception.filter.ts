import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponse } from '../interfaces/api-response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const requestId = request.headers['x-request-id'] || uuidv4();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';
    let details: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message;
        details = (exceptionResponse as any).details;
      }
      
      code = this.getErrorCode(status);
    } else if (exception instanceof Error) {
      message = exception.message;
      code = 'APPLICATION_ERROR';
    }

    const errorResponse: ApiResponse = {
      succeeded: false,
      message,
      error: {
        code,
        details,
        timestamp: new Date().toISOString(),
        requestId: requestId as string,
      },
    };

    // Log error with context
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      {
        requestId,
        userId: (request as any).user?.sub,
        ip: request.ip,
        userAgent: request.headers['user-agent'],
        stack: exception instanceof Error ? exception.stack : undefined,
      },
    );

    // Handle both Fastify and Express responses
    if (response.code && typeof response.code === 'function') {
      // Fastify response
      response.code(status).send(errorResponse);
    } else {
      // Express response (fallback)
      response.status(status).json(errorResponse);
    }
  }

  private getErrorCode(status: number): string {
    const codes = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      429: 'RATE_LIMITED',
      500: 'INTERNAL_ERROR',
    };
    return codes[status] || 'UNKNOWN_ERROR';
  }
}