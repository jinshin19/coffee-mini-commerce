// NestJs Imports
import { Module } from "@nestjs/common";
// import { JwtModule } from "@nestjs/jwt";
// import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
// Modules
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
// Schemas
import { AdminUser, AdminUserSchema } from "../../common/schemas";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AdminUser.name, schema: AdminUserSchema },
    ]),
    // JwtModule.registerAsync({
    //   inject: [ConfigService],
    //   // useFactory: (configService: ConfigService) => ({
    //   //   secret:
    //   //     configService.get<string>("JWT_SECRET") ||
    //   //     "fallback-secret-change-me",
    //   //   signOptions: { expiresIn: "7d" },
    //   // }),
    // }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, MongooseModule],
})
export class AuthModule {}
