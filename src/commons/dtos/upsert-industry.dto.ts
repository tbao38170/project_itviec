import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

//upsert = update + insert
export class UpsertIndustryDto {
  @ApiProperty({ example: "Linh Vuc" })
  @IsString()
  @IsNotEmpty()
  name: string;
}
