import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileOptions } from "@supabase/storage-js";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { log } from "console";

@Injectable()
export class StorageService {
  //laay du lieyu ra : repository : can lay ra
  private client: SupabaseClient;
  private bucket: string;
  constructor(private readonly configService: ConfigService) {
    this.client = createClient(
      this.configService.get("supabase").url,
      this.configService.get("supabase").key
    );
    this.bucket = this.configService.get("supabase").bucket;
  }

  async uploadFile(key: string, file: Buffer, options: FileOptions = {}) {
    const { data, error } = await this.client.storage
      .from(this.bucket)
      .upload(key, file, {
        ...options,
      });
    console.log("data : ", data);
    console.log("error : ", error);

    return {
      path: key,
    };
  }
  async getSignUrl(key: string, expiresIn = 600) {
    const { data, error } = await this.client.storage
      .from(this.bucket)
      .createSignedUrl(key, expiresIn);

    if (error) {
      throw new Error("getSignedUrl failed :" + error.message);
    }

    return data.signedUrl;
  }

  async deteleFile(key: string) {
    const { data, error } = await this.client.storage
      .from(this.bucket)
      .remove([key]);

    if (error) {
      throw new Error("Delete file failed :" + error.message);
    }
    return data;
  }
}
