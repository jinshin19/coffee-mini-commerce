// NestJs Imports
import { Module } from "@nestjs/common";
// import { JwtModule } from "@nestjs/jwt";
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
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, MongooseModule],
})
export class AuthModule {}
