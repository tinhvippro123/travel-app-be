import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtPayload } from '@modules/auth/strategies/jwt.strategy.js';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user: JwtPayload }>();
    return request.user;
  },
);
