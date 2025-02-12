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
import { UpsertIndustryDto } from "src/commons/dtos/upsert-Industry.dto";
import { IndustryRepository } from "src/databases/repositories/Industry.repository";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "src/commons/decorators/role.decorator";
import { ROLE } from "src/commons/enums/user.enum";
import { IndustryQueryDto } from "src/commons/dtos/Industry-query.dto";
import { IndustryService } from "./Industry.service";

@ApiBearerAuth()
@Controller("Industry")
export class IndustryController {
  constructor(
    public readonly skillService: IndustryService
    // private readonly skillRepository: IndustryRepository
  ) {}
  //=======================================
  @Roles(ROLE.ADMIN)
  @Post()
  create(@Body() body: UpsertIndustryDto) {
    return this.skillService.create(body);
  }

  //=================
  @Roles(ROLE.ADMIN)
  @Put(`:id`)
  update(@Body() body: UpsertIndustryDto, @Param(`id`) id: number) {
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
  getAll(@Query() queries: IndustryQueryDto) {
    return this.skillService.getAll(queries);
  }
  //=================
  @Roles(ROLE.ADMIN)
  @Delete(`:id`)
  delete(@Param(`id`) id: number) {
    return this.skillService.delete(id);
  }
}
