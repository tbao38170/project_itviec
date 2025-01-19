import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { IS_PUBLIC_KEY } from "src/commons/decorators/public.decorator";

@Injectable()
export class AuthGuard {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private reflector: Reflector
  ) {}

  async canActivate(context) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }
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
    return true;
  }

  private extracTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
