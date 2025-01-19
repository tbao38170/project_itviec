import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { IsStrongPassword } from "../decorators/is-strong-password.decorator";

export class RefreshTokenDto {
  @ApiProperty({
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzM3MTg0NDgyLCJleHAiOjE3Mzc3ODkyODJ9.njzvC9vI2KGzsdCiVfeQjctBAABOyrpETjvdlbRwcdw",
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
