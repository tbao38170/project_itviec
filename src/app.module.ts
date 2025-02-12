import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configuration from "./configs/configuration";
import { DatabaseModule } from "./databases/database.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ormConfig } from "./ormconfig";
import { AuthModule } from "./modules/auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./modules/auth/auth.guard";
import { MailModule } from "./modules/mail/mail.module";
import { StorageModule } from "./modules/storage/storage.module";
import { SkillModule } from "./modules/skill/skill.module";

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    TypeOrmModule.forRoot(ormConfig),
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], //
      inject: [ConfigService], // lay dc bientu configduration
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("jwtAuth").jwtTokenSecret,
        signOptions: { expiresIn: "60s" },
      }),
      // global: true,
      // secret: jwtConstants.secret,
      // signOptions: { expiresIn: "60s" },
    }),
    AuthModule,
    // MailModule,
    StorageModule,
    SkillModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
      // useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
