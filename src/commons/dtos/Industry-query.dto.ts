import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

//upsert = update + insert
export class IndustryQueryDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name: string;
}
