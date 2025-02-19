import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { IndustryQueryDto } from "src/commons/dtos/industry-query.dto";

import { UpsertIndustryDto } from "src/commons/dtos/upsert-industry.dto";
import { IndustryRepository } from "src/databases/repositories/industry.repository";
import { ILike } from "typeorm";

@Injectable()
export class IndustryService {
  //laay du lieyu ra : repository : can lay ra
  constructor(private readonly industryRepository: IndustryRepository) {}

  //func crud : create update, read, delete

  async create(body: UpsertIndustryDto) {
    const industryRecord = await this.industryRepository.save(body);

    return {
      message: "create Industry successfully!",
      result: industryRecord,
    };
  }
  async get(id: number) {
    const industryRecord = await this.industryRepository.findOneBy({ id });

    return {
      message: "Get detail Industry successfully!",
      result: industryRecord,
    };
  }
  //====================================================
  async getAll(queries: IndustryQueryDto) {
    const { name } = queries;

    const whereClause = name ? ILike(`%${name}%`) : {};
    const result = await this.industryRepository.find({
      where: whereClause,
    });

    return {
      message: "Get detail Industry successfully!",
      result,
    };
  }

  //=============================================
  async update(body: UpsertIndustryDto, id: number) {
    const industryRecord = await this.industryRepository.findOneBy({ id });

    //check ton tai
    if (!industryRecord) {
      throw new HttpException("Industry not found", HttpStatus.NOT_FOUND);
    }
    const industryUpdated = await this.industryRepository.save({
      ...industryRecord,
      ...body,
    });

    return {
      message: "Update Industry successfully!",
      result: industryUpdated,
    };
  }
  //======================================================
  async delete(id: number) {
    const industryRecord = await this.industryRepository.delete({ id });

    return {
      message: "delete Industry successfully!",
      result: industryRecord,
    };
  }
  //================================
}
