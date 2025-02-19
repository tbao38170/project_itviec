import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UpsertManuscriptDto } from "src/commons/dtos/upsert-manuscript.dto";
import { ManuscriptSkill } from "src/databases/entities/manuscript-skill.entity";
import { Manuscript } from "src/databases/entities/manuscript.entity";
import { User } from "src/databases/entities/user.entity";
import { CompanyRepository } from "src/databases/repositories/company.repository";
import { ManuscriptRepository } from "src/databases/repositories/manuscript.repository";
import { DataSource } from "typeorm";
// import { ManuscriptQueryDto } from "src/commons/dtos/Manuscript-query.dto";

@Injectable()
export class ManuscriptService {
  //laay du lieyu ra : repository : can lay ra
  constructor(
    private readonly manuscriptRepository: ManuscriptRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly dataSource: DataSource
  ) {}

  //func crud : create update, read, delete

  async create(body: UpsertManuscriptDto, currentUser: User) {
    // dung transaction de thao tac le 2 bang manuscript and skill
    //tim company de gan vao
    const companyRecord = await this.companyRepository.findOneBy({
      userId: currentUser.id, // chi co hr trong cty moi update dc
    });

    //check ton tai
    if (!companyRecord) {
      throw new HttpException("Company not found", HttpStatus.NOT_FOUND);
    }
    //
    const { skillIds } = body;
    delete body.skillIds; //xoa di vi manuscript ko co truong nay

    //
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    console.log("Starting transaction...");
    await queryRunner.startTransaction();
    try {
      const manuscriptRecord = await queryRunner.manager.save(Manuscript, {
        ...body,
        companyId: companyRecord.id,
      });

      const manuscriptSkills = skillIds.map((skillId) => ({
        manuscriptId: manuscriptRecord.id,
        skillId,
      }));

      await queryRunner.manager.save(ManuscriptSkill, manuscriptSkills);
      //
      console.log("Committing transaction...");
      // if (queryRunner.isTransactionActive) {
      await queryRunner.commitTransaction();
      return {
        message: "create Manuscript successfully!",
        result: "manuscriptRecord",
      };
    } catch (error) {
      console.error("Transaction error:", error);

      await queryRunner.rollbackTransaction();
    } finally {
      console.log("Releasing query runner...");
      await queryRunner.release();
    }

    return {
      message: "create Manuscript successfully!",
      // result: manuscriptRecord,
    };
  }
  //===========================================
  async get(id: number) {
    const manuscriptRecord = await this.manuscriptRepository.findOneBy({ id });

    return {
      message: "Get detail Manuscript successfully!",
      result: manuscriptRecord,
    };
  }
  //====================================================
  // async getAll(queries: ManuscriptQueryDto) {
  //   const { name } = queries;

  //   const whereClause = name ? ILike(`%${name}%`) : {};
  //   const result = await this.manuscriptRepository.find({
  //     where: whereClause,
  //   });

  // return {
  //   message: "Get detail Manuscript successfully!",
  //   result,
  // };
  // }

  //=============================================
  async update(body: UpsertManuscriptDto, id: number, currnetUser: User) {}
  //======================================================
  async delete(id: number, currnetUser: User) {
    // thuc hien xoa mêm : đánh dấu bản ghi là đã xóa chứ ko xóa hẳn trong db

    // validate userhr
    //tim company de gan vao
    const companyRecord = await this.companyRepository.findOneBy({
      userId: currnetUser.id, // chi co hr trong cty moi update dc
    });
    const manuscriptRecord = await this.manuscriptRepository.findOneBy({
      id,
    });
    // check xem cty hr co phai la cty dang blog
    if (companyRecord.id !== manuscriptRecord.companyId) {
      throw new HttpException("Company FORBIDDEN", HttpStatus.FORBIDDEN);
    }
    // const manuscriptRecord = await this.manuscriptRepository.delete({ id });
    await this.manuscriptRepository.softDelete(id);
    return {
      message: "(Soft) delete Manuscript successfully!",
      result: manuscriptRecord,
    };
  }
  //================================
}
