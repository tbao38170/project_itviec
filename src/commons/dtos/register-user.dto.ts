import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { IsStrongPassword } from "../decorators/is-strong-password.decorator";

export class RegisterUserDto {
  @ApiProperty({ example: "user" })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: "k01-itviec@yopmail.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // dugn password thif hoc dung swakker

  @ApiProperty({ example: "Bao@12345678" })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
