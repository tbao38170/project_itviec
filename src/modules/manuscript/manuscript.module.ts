import { Module } from "@nestjs/common";
import { ManuscriptController } from "./manuscript.controller";
import { ManuscriptService } from "./manuscript.service";
import { CompanyRepository } from "src/databases/repositories/company.repository";
import { ManuscriptRepository } from "src/databases/repositories/manuscript.repository";
import { DataSource } from "typeorm";
import { Manuscript } from "src/databases/entities/manuscript.entity";
import { ManuscriptSkill } from "src/databases/entities/manuscript-skill.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  // imports: [TypeOrmModule.forFeature([Manuscript, ManuscriptSkill])],
  controllers: [ManuscriptController],
  providers: [
    ManuscriptService,
    ManuscriptRepository,
    CompanyRepository,
    // DataSource,
  ],
})
export class ManuscriptModule {}
