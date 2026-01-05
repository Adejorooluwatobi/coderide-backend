import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PaginationParams } from '../interfaces/api-response.interface';

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PaginationParams => {
    const request = ctx.switchToHttp().getRequest();
    const { page = 1, limit = 10, sortBy, sortOrder = 'desc' } = request.query;

    return {
      page: Math.max(1, parseInt(page as string, 10)),
      limit: Math.min(100, Math.max(1, parseInt(limit as string, 10))),
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'asc' | 'desc',
    };
  },
);

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
) {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}