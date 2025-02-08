import { Controller, Get, Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserRepository } from "src/databases/repositories/user.repository";
import { ApplicantRepository } from "src/databases/repositories/applicant.repository";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { CompanyRepository } from "src/databases/repositories/company.repository";

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    ApplicantRepository,
    CompanyRepository,
    JwtService,
    ConfigService,
  ],
})
// @Controller("auth")
export class AuthModule {
  // @Get()
  // findAll(): string {
  //   return "This action returns all cats";
  // }
}
