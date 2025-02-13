import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetCurrentUser = createParamDecorator(
  (data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest().user;

    if (!request) {
      return null;
    }

    return data ? request[data] : request; // extract a specific property only if specified or get a user object
  }
);
