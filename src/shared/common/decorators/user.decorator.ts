import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // 'data' would allow you to specify the field, e.g., @User('id')
    return data ? request.user?.[data] : request.user; 
  },
);