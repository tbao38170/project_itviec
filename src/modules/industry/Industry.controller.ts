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
import { UpsertIndustryDto } from "src/commons/dtos/upsert-industry.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "src/commons/decorators/role.decorator";
import { ROLE } from "src/commons/enums/user.enum";
import { IndustryQueryDto } from "src/commons/dtos/industry-query.dto";
import { IndustryService } from "./industry.service";

@ApiBearerAuth()
@Controller("Industry")
export class IndustryController {
  constructor(
    public readonly industryService: IndustryService
    // private readonly industryRepository: IndustryRepository
  ) {}
  //=======================================
  @Roles(ROLE.ADMIN)
  @Post()
  create(@Body() body: UpsertIndustryDto) {
    return this.industryService.create(body);
  }

  //=================
  @Roles(ROLE.ADMIN)
  @Put(`:id`)
  update(@Body() body: UpsertIndustryDto, @Param(`id`) id: number) {
    return this.industryService.update(body, id);
  }
  //=====================
  @Public()
  // @Roles(ROLE.ADMIN, )
  @Get(`:id`)
  get(@Param(`id`) id: number) {
    return this.industryService.get(id);
  }
  //=====================
  @Public()
  // @Roles(ROLE.ADMIN, )
  @Get()
  getAll(@Query() queries: IndustryQueryDto) {
    return this.industryService.getAll(queries);
  }
  //=================
  @Roles(ROLE.ADMIN)
  @Delete(`:id`)
  delete(@Param(`id`) id: number) {
    return this.industryService.delete(id);
  }
}
