import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { SkillService } from "./skill.service";
import { Public } from "src/commons/decorators/public.decorator";
import { UpsertSkillDto } from "src/commons/dtos/upsert-skill.dto";
import { SkillRepository } from "src/databases/repositories/skill.repository";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "src/commons/decorators/role.decorator";
import { ROLE } from "src/commons/enums/user.enum";

@ApiBearerAuth()
@Controller("skill")
export class SkillController {
  constructor(
    public readonly skillService: SkillService
    // private readonly skillRepository: SkillRepository
  ) {}
  //=======================================
  @Roles(ROLE.ADMIN)
  @Post()
  create(@Body() body: UpsertSkillDto) {
    return this.skillService.create(body);
  }

  //=================
  @Roles(ROLE.ADMIN)
  @Put(`:id`)
  update(@Body() body: UpsertSkillDto, @Param(`id`) id: number) {
    return this.skillService.update(body, id);
  }
  //=====================
  @Public()
  // @Roles(ROLE.ADMIN, )
  @Get(`:id`)
  get(@Param(`id`) id: number) {
    return this.skillService.get(id);
  }
  //=====================
  @Public()
  // @Roles(ROLE.ADMIN, )
  @Get()
  getAll(@Body() body: UpsertSkillDto) {
    return this.skillService.getAll(body);
  }
  //=================
  @Roles(ROLE.ADMIN)
  @Delete(`:id`)
  delete(@Param(`id`) id: number) {
    return this.skillService.delete(id);
  }
}
