import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { StorageService } from "./storage.service";
import { Public } from "src/commons/decorators/public.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { UploadedFileDto } from "src/commons/dtos/upload-file.dto";
import { log } from "console";

@Controller("storage")
export class StorageController {
  constructor(public readonly storageService: StorageService) {}

  @Public()
  @Post("upload/image")
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: UploadedFileDto })
  @UseInterceptors(FileInterceptor("file"))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    //validate file type
    const validateMineType = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!validateMineType.includes(file.mimetype)) {
      throw new BadRequestException("Invalid file size. Only images are allow");
    }

    // validate size
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new BadRequestException("File size exceeds the 5MB ");
    }

    //=====
    const filePath = `/images/${Date.now()}/${file.originalname}`;
    const uploadResult = await this.storageService.uploadFile(
      filePath,
      file.buffer
    );
    // console.log(file, "file");
    const publicUrl = await this.storageService.getSignUrl(uploadResult.path);

    return {
      message: "File upload successfully!",
      result: {
        publicUrl,
        path: uploadResult.path,
      },
    };
  }
  @Public()
  @Post("upload/cvs")
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: UploadedFileDto })
  @UseInterceptors(FileInterceptor("file"))
  async uploadCvs(@UploadedFile() file: Express.Multer.File) {
    //validate file type
    const [, fileType] = file.originalname.split(".");
    const validateMineType = ["pdf", "docx", "doc", "txt"];
    if (!validateMineType.includes(fileType)) {
      throw new BadRequestException("Invalid file size. Only file are allow");
    }

    // validate size
    const maxSizeBytes = 3 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new BadRequestException("File size exceeds the 3MB ");
    }

    //=====
    const filePath = `/cvs/${Date.now()}/${file.originalname}`;
    const uploadResult = await this.storageService.uploadFile(
      filePath,
      file.buffer
    );
    // console.log(file, "file");
    const publicUrl = await this.storageService.getSignUrl(uploadResult.path);

    return {
      message: "File upload successfully!",
      result: {
        publicUrl,
        path: uploadResult.path,
      },
    };
  }

  @Public()
  @Delete("delete/cv")
  async deleteFile(@Body() body: { key: string }) {
    const result = await this.storageService.deteleFile(body.key);
    console.log(result, "result");
    return {
      message: "Delete file successfully!",
    };
  }
}
