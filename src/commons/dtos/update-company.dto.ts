import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import {
  COMPANY_ADDRESS,
  COMPANY_SIZE,
  COMPANY_TYPE,
} from "../enums/company.enum";

//upsert = update + insert
export class UpdateCompanyDto {
  @ApiProperty({ example: "Font-End" })
  @IsNumber()
  @IsOptional()
  industryId: number;

  @ApiProperty({ example: "LG" })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ example: "itviec.com" })
  @IsString()
  @IsOptional()
  website: string;

  @ApiProperty({ example: "this is company " })
  @IsString()
  @IsOptional()
  desciption: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  logo: string;

  @ApiProperty({ example: "132456" })
  @IsString()
  @IsOptional()
  codeTax: string;

  @ApiProperty({ example: COMPANY_ADDRESS.HA_NOI })
  @IsEnum(COMPANY_ADDRESS)
  @IsOptional()
  location: COMPANY_ADDRESS;

  @ApiProperty({ example: COMPANY_SIZE.SMALL })
  @IsEnum(COMPANY_SIZE)
  @IsOptional()
  companySize: COMPANY_SIZE;

  @ApiProperty({ example: COMPANY_TYPE.NON_IT })
  @IsEnum(COMPANY_TYPE)
  @IsOptional()
  companyType: COMPANY_TYPE;

  @ApiProperty({ example: "Font-End" })
  @IsString()
  @IsOptional()
  workingDay: string;
}
