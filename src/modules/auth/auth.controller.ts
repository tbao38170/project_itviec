import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "src/commons/dtos/register-user.dto";
import { LoginDto } from "src/commons/dtos/login.dto";
import { AuthGuard } from "./auth.guard";
import { RefreshTokenDto } from "src/commons/dtos/refresh-token.dto";
import { Public } from "src/commons/decorators/public.decorator";
import { LoginGGDto } from "src/commons/dtos/loginGG.dto";
import { RegisterCompanyDto } from "src/commons/dtos/register-company.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post("register")
  registerUser(@Body() body: RegisterUserDto) {
    return this.authService.registerUser(body);
  }

  //api login
  @Public()
  @Post("login")
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
  @Public()
  @Post("login-google")
  loginWithGG(@Body() body: LoginGGDto) {
    return this.authService.loginWithGG(body);
  }
  //api refresh token login
  @Public()
  @Post("refresh-token")
  refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refresh(body);
  }

  // @UseGuards(AuthGuard)
  @Get()
  test() {
    return {
      message: "test Guards",
    };
  }

  @Public()
  @Post("register-company")
  registerCompany(@Body() body: RegisterCompanyDto) {
    return this.authService.registerCompany(body);
  }
}
