import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UpdateCompanyDto } from "src/commons/dtos/update-company.dto";
import { User } from "src/databases/entities/user.entity";
import { CompanyRepository } from "src/databases/repositories/company.repository";
import { StorageService } from "../storage/storage.service";
import { IndustryRepository } from "src/databases/repositories/Industry.repository";

@Injectable()
export class CompanyService {
  //laay du lieyu ra : repository : can lay ra
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly storageService: StorageService,
    private readonly industryRepository: IndustryRepository
  ) {}

  //func crud : create update, read, delete

  // async create(body: UpdateCompanyDto) {
  //   const companyRecord = await this.companyRepository.save(body);

  //   return {
  //     message: "create Company successfully!",
  //     result: companyRecord,
  //   };
  // }
  // async get(id: number) {
  //   const companyRecord = await this.companyRepository.findOneBy({ id });

  //   return {
  //     message: "Get detail Company successfully!",
  //     result: companyRecord,
  //   };
  // }
  // //====================================================
  // async getAll(queries: UpdateCompanyDto) {
  //   const { name } = queries;

  //   const whereClause = name ? ILike(`%${name}%`) : {};
  //   const result = await this.companyRepository.find({
  //     where: whereClause,
  //   });

  //   return {
  //     message: "Get detail Company successfully!",
  //     result,
  //   };
  // }

  //=============================================
  async update(body: UpdateCompanyDto, id: number, currentUser: User) {
    // console.log(currentUser, "currentUser");
    //validate ch co hr trog company moi update dc company
    const companyRecord = await this.companyRepository.findOneBy({
      id,
      userId: currentUser.id, // chi co hr trong cty moi update dc
    });

    //check ton tai
    if (!companyRecord) {
      throw new HttpException("Company not found", HttpStatus.NOT_FOUND);
    }
    // luu anh logo
    if (body.logo) {
      await this.storageService.getSignUrl(body.logo);
    }
    //validate industtry
    const industryRecord = await this.industryRepository.findOneBy({
      id: body.industryId,
    });
    if (!industryRecord) {
      throw new HttpException("Company not found", HttpStatus.NOT_FOUND);
    }
    //
    const companyUpdated = await this.companyRepository.save({
      ...companyRecord,
      ...body,
    });
    //genarete link
    if (companyUpdated.logo) {
      companyUpdated.logo = await this.storageService.getSignUrl(
        companyUpdated.logo
      );
    }

    //xoa file anh neu thay doi
    if (companyRecord.logo !== body.logo) {
      await this.storageService.deteleFile(companyRecord.logo);
    }

    return {
      message: "Update Company successfully!",
      result: companyUpdated,
    };
  }
  //======================================================
  // async delete(id: number) {
  //   const companyRecord = await this.companyRepository.delete({ id });

  //   return {
  //     message: "delete Company successfully!",
  //     result: companyRecord,
  //   };
  // }
  //================================
}
