import { ApiProperty } from "@nestjs/swagger";
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { COMPANY_ADDRESS } from "../enums/company.enum";
import { APPLICANT_LEVEL, WORKING_MODEL } from "../enums/manuscript.enum";
import { Transform } from "class-transformer";

//upsert = update + insert
export class UpsertManuscriptDto {
  @ApiProperty()
  @IsNumber({}, { each: true }) // moi phan tu la 1 number
  @IsOptional()
  skillIds: number[];

  @ApiProperty({ example: "string" })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ example: "abcdefghik" })
  @IsString()
  @IsOptional()
  summary: string;

  @ApiProperty({ example: "this is manuscript " })
  @IsString()
  @IsOptional()
  descriptions: string;

  @ApiProperty({ example: "string" })
  @IsString()
  @IsOptional()
  requirement: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsOptional()
  quantity: number;

  @ApiProperty({ example: "string" })
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty({ example: COMPANY_ADDRESS.HA_NOI, enum: COMPANY_ADDRESS })
  @IsEnum(COMPANY_ADDRESS)
  @IsOptional()
  location: COMPANY_ADDRESS;

  @ApiProperty({ example: APPLICANT_LEVEL.FRESHER, enum: APPLICANT_LEVEL })
  @IsEnum(APPLICANT_LEVEL)
  @IsOptional()
  level: APPLICANT_LEVEL;

  @ApiProperty({ example: WORKING_MODEL.AT_OFFICE, enum: WORKING_MODEL })
  @IsEnum(WORKING_MODEL)
  @IsOptional()
  workingModel: WORKING_MODEL;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @IsOptional()
  minSalary: number;

  @ApiProperty({ example: 10000 })
  @IsNumber()
  @IsOptional()
  maxSalary: number;

  @ApiProperty({ example: "VND" })
  @IsString()
  @IsOptional()
  currencySalary: string;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value)) // convert string date to date
  startDate: Date;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => new Date(value)) // convert string date to date
  endDate: string;

  // @ApiProperty()
  // @IsDate()
  // @IsOptional()
  // countView: string;

  // @ApiProperty({ example: "2" })
  // @IsNumber()
  // @IsOptional()
  // companyId: number;
}
