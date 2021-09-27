import { User } from './entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetBearerToken = createParamDecorator((data, ctx): User => {
  const req = ctx.switchToHttp().getRequest();
  try {
    return req.headers.authorization.split(' ')[1];
  } catch (error) {
    return null;
  }
});
