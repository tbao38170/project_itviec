import { Module } from "@nestjs/common";
import { IndustryService } from "./Industry.service";
import { IndustryController } from "./Industry.controller";
import { IndustryRepository } from "src/databases/repositories/Industry.repository";

@Module({
  controllers: [IndustryController],
  providers: [IndustryService, IndustryRepository],
})
export class IndustryModule {}
