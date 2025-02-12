import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UpdateCompanyDto } from "src/commons/dtos/update-company.dto";
import { CompanyRepository } from "src/databases/repositories/company.repository";

@Injectable()
export class CompanyService {
  //laay du lieyu ra : repository : can lay ra
  constructor(private readonly companyRepository: CompanyRepository) {}

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
  async update(body: UpdateCompanyDto, id: number) {
    //validate ch co hr trog company moi updtae dc company
    const companyRecord = await this.companyRepository.findOneBy({ id });

    //check ton tai
    if (!companyRecord) {
      throw new HttpException("Company not found", HttpStatus.NOT_FOUND);
    }
    const companyUpdated = await this.companyRepository.save({
      ...companyRecord,
      ...body,
    });

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
