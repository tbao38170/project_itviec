import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { IsStrongPassword } from "../decorators/is-strong-password.decorator";
import { COMPANY_ADDRESS } from "../enums/company.enum";

export class RegisterCompanyDto {
  @ApiProperty({ example: "hr1" })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: "hr1@gmail.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // dugn password thif hoc dung swakker

  @ApiProperty({ example: "Bao@12345678" })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  //company name
  @ApiProperty({ example: "Panasonic" })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  //
  @ApiProperty({ example: COMPANY_ADDRESS.HO_CHI_MINH })
  @IsEnum(COMPANY_ADDRESS)
  @IsNotEmpty()
  companyAddress: COMPANY_ADDRESS;

  //
  @ApiProperty({ example: "it_viec.com" })
  @IsString()
  @IsNotEmpty()
  companyWebsite: string;
}
