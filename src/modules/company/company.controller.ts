import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";

import { Public } from "src/commons/decorators/public.decorator";
import { CompanyRepository } from "src/databases/repositories/company.repository";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "src/commons/decorators/role.decorator";
import { ROLE } from "src/commons/enums/user.enum";
import { CompanyService } from "./company.service";
import { UpdateCompanyDto } from "src/commons/dtos/update-company.dto";
import { GetCurrentUser } from "src/commons/decorators/get-current-user.decorator";
import { User } from "src/databases/entities/user.entity";

@ApiBearerAuth()
@Controller("company")
export class CompanyController {
  constructor(
    public readonly companyService: CompanyService
    // private readonly companyRepository: CompanyRepository
  ) {}
  //=======================================
  // @Roles(ROLE.ADMIN)
  // @Post()
  // create(@Body() body: UpdateCompanyDto) {
  //   return this.companyService.create(body);
  // }

  //=================
  @Roles(ROLE.COMPANY)
  @Put(`:id`)
  update(
    @Body() body: UpdateCompanyDto,
    @Param(`id`) id: number,
    @GetCurrentUser() currentUser: User
  ) {
    return this.companyService.update(body, id, currentUser);
  }
  //=====================
  // @Public()
  // // @Roles(ROLE.ADMIN, )
  // @Get(`:id`)
  // get(@Param(`id`) id: number) {
  //   return this.companyService.get(id);
  // }
  // //=====================
  // @Public()
  // // @Roles(ROLE.ADMIN, )
  // @Get()
  // getAll(@Query() queries: UpdateCompanyDto) {
  //   return this.companyService.getAll(queries);
  // }
  // //=================
  // @Roles(ROLE.ADMIN)
  // @Delete(`:id`)
  // delete(@Param(`id`) id: number) {
  //   return this.companyService.delete(id);
  // }
}
