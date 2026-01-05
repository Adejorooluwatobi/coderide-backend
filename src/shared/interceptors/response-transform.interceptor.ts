import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data is already in ApiResponse format, return as is
        if (data && typeof data === 'object' && 'succeeded' in data) {
          return data;
        }

        // Transform raw data into ApiResponse format
        return {
          succeeded: true,
          message: 'Request completed successfully',
          resultData: data,
        };
      }),
    );
  }
}