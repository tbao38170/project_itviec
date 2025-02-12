import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

//upsert = update + insert
export class UpsertSkillDto {
  @ApiProperty({ example: "Font-End" })
  @IsString()
  @IsNotEmpty()
  name: string;
}
