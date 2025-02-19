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
import { ApiBearerAuth } from "@nestjs/swagger";
import { ManuscriptService } from "./manuscript.service";
import { Roles } from "src/commons/decorators/role.decorator";
import { ROLE } from "src/commons/enums/user.enum";
import { UpsertManuscriptDto } from "src/commons/dtos/upsert-manuscript.dto";
import { GetCurrentUser } from "src/commons/decorators/get-current-user.decorator";
import { User } from "src/databases/entities/user.entity";
import { Public } from "src/commons/decorators/public.decorator";

@ApiBearerAuth()
@Controller("Manuscript")
export class ManuscriptController {
  constructor(public readonly manuscriptService: ManuscriptService) {}
  //=======================================
  @Roles(ROLE.COMPANY)
  @Post()
  create(
    @Body() body: UpsertManuscriptDto,
    @GetCurrentUser() currentUser: User
  ) {
    return this.manuscriptService.create(body, currentUser);
  }

  //=================
  @Roles(ROLE.ADMIN)
  @Put(`:id`)
  update(
    @Body() body: UpsertManuscriptDto,
    @Param(`id`) id: number,
    @GetCurrentUser() currentUser: User
  ) {
    return this.manuscriptService.update(body, id, currentUser);
  }
  //=====================
  // @Roles(ROLE.ADMIN, )
  @Get(`:id`)
  get(@Param(`id`) id: number) {
    return this.manuscriptService.get(id);
  }
  //=====================
  // @Public()
  // // @Roles(ROLE.ADMIN, )
  // @Get()
  // getAll(@Query() queries: ManuscriptQueryDto) {
  //   return this.manuscriptService.getAll(queries);
  // }
  //=================
  @Roles(ROLE.ADMIN)
  @Delete(`:id`)
  delete(@Param(`id`) id: number, @GetCurrentUser() currentUser: User) {
    return this.manuscriptService.delete(id, currentUser);
  }
}
