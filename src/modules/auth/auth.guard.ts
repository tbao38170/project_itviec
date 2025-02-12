import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { log } from "console";
import { Request } from "express";
import { IS_PUBLIC_KEY } from "src/commons/decorators/public.decorator";
import { ROLES_KEY } from "src/commons/decorators/role.decorator";
import { ROLE } from "src/commons/enums/user.enum";

@Injectable()
export class AuthGuard {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private reflector: Reflector
  ) {}

  async canActivate(context) {
    //check APi Public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    //true
    if (isPublic) {
      // 💡 See this condition
      return true;
    }
    //chekc user exists in
    const request = context.switchToHttp().getRequest();

    const token = this.extracTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(); // ko phai user he thonmg 401
    }
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get("jwtAuth").jwtTokenSecret,
      });
      request["user"] = payload;
    } catch {
      throw new UnauthorizedException(); // ko phai user he thonmg 401
    }
    // return true;

    //check role user
    const requiredRoles = this.reflector.getAllAndOverride<ROLE[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    // console.log(user, "user");

    const result = requiredRoles.some((role) => user.role?.includes(role));
    // console.log(result);

    return result;
    //   const roles = this.reflector.get(Roles, context.getHandler());
    //   if (!roles) {
    //     return true;
    //   }
    //   const request = context.switchToHttp().getRequest();
    //   const user = request.user;
    //   return matchRoles(roles, user.roles);
  }

  private extracTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
