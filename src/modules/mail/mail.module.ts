import { Injectable, Module } from "@nestjs/common";

import { MailService } from "./mail.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from "path";

@Module({
  providers: [MailService],
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get("mail").host,
          port: configService.get("mail").port,
          // ignoreTLS: true,
          // secure: false,
          auth: {
            user: configService.get("mail").user,
            pass: configService.get("mail").pass,
          },
        },
        // tls: {
        //   rejectUnauthorized: false, // Tắt kiểm tra chứng chỉ (nếu cần)
        // },
        defaults: {
          from: configService.get("mail").from,
        },
        template: {
          dir: join(__dirname, "../../assets/mail/templates"),

          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        connectionTimeout: 10000,
      }),
    }),
  ],
})
export class MailModule {}
