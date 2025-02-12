import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { SkillQueryDto } from "src/commons/dtos/skill-query.dto";

import { UpsertSkillDto } from "src/commons/dtos/upsert-skill.dto";
import { SkillRepository } from "src/databases/repositories/skill.repository";
import { ILike } from "typeorm";

@Injectable()
export class SkillService {
  //laay du lieyu ra : repository : can lay ra
  constructor(private readonly skillRepository: SkillRepository) {}

  //func crud : create update, read, delete

  async create(body: UpsertSkillDto) {
    const skillRecord = await this.skillRepository.save(body);

    return {
      message: "create skill successfully!",
      result: skillRecord,
    };
  }
  async get(id: number) {
    const skillRecord = await this.skillRepository.findOneBy({ id });

    return {
      message: "Get detail skill successfully!",
      result: skillRecord,
    };
  }
  //====================================================
  async getAll(queries: SkillQueryDto) {
    const { name } = queries;

    const whereClause = name ? ILike(`%${name}%`) : {};
    const result = await this.skillRepository.find({
      where: whereClause,
    });

    return {
      message: "Get detail skill successfully!",
      result,
    };
  }

  //=============================================
  async update(body: UpsertSkillDto, id: number) {
    const skillRecord = await this.skillRepository.findOneBy({ id });

    //check ton tai
    if (!skillRecord) {
      throw new HttpException("Skill not found", HttpStatus.NOT_FOUND);
    }
    const skillUpdated = await this.skillRepository.save({
      ...skillRecord,
      ...body,
    });

    return {
      message: "Update skill successfully!",
      result: skillUpdated,
    };
  }
  //======================================================
  async delete(id: number) {
    const skillRecord = await this.skillRepository.delete({ id });

    return {
      message: "delete skill successfully!",
      result: skillRecord,
    };
  }
  //================================
}
