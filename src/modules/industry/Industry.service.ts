import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { IndustryQueryDto } from "src/commons/dtos/Industry-query.dto";

import { UpsertIndustryDto } from "src/commons/dtos/upsert-Industry.dto";
import { IndustryRepository } from "src/databases/repositories/Industry.repository";
import { ILike } from "typeorm";

@Injectable()
export class IndustryService {
  //laay du lieyu ra : repository : can lay ra
  constructor(private readonly skillRepository: IndustryRepository) {}

  //func crud : create update, read, delete

  async create(body: UpsertIndustryDto) {
    const skillRecord = await this.skillRepository.save(body);

    return {
      message: "create Industry successfully!",
      result: skillRecord,
    };
  }
  async get(id: number) {
    const skillRecord = await this.skillRepository.findOneBy({ id });

    return {
      message: "Get detail Industry successfully!",
      result: skillRecord,
    };
  }
  //====================================================
  async getAll(queries: IndustryQueryDto) {
    const { name } = queries;

    const whereClause = name ? ILike(`%${name}%`) : {};
    const result = await this.skillRepository.find({
      where: whereClause,
    });

    return {
      message: "Get detail Industry successfully!",
      result,
    };
  }

  //=============================================
  async update(body: UpsertIndustryDto, id: number) {
    const skillRecord = await this.skillRepository.findOneBy({ id });

    //check ton tai
    if (!skillRecord) {
      throw new HttpException("Industry not found", HttpStatus.NOT_FOUND);
    }
    const skillUpdated = await this.skillRepository.save({
      ...skillRecord,
      ...body,
    });

    return {
      message: "Update Industry successfully!",
      result: skillUpdated,
    };
  }
  //======================================================
  async delete(id: number) {
    const skillRecord = await this.skillRepository.delete({ id });

    return {
      message: "delete Industry successfully!",
      result: skillRecord,
    };
  }
  //================================
}
