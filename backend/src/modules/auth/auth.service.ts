// NestJs Imports
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { InjectModel } from "@nestjs/mongoose";
import {
  Logger,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
// DTO's
import { LoginAdminDTO } from "./dto";
// Services
import {
  ResponseHandlerService,
  ErrorResponseHandlerService,
} from "@src/common/services";
// Interfaces
import { ResponseHandlerServiceI } from "@src/common/interfaces";
// Auth Service
import { GenerateAuthorizationToken } from "./auth-depth.service";
// Schemas
import { AdminUser, AdminUserDocument } from "../../common/schemas";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(AdminUser.name)
    private readonly adminUserModel: Model<AdminUserDocument>,
  ) {}

  async login(
    userAgent: string,
    body: LoginAdminDTO,
  ): Promise<ResponseHandlerServiceI> {
    try {
      const user = await this.adminUserModel
        .findOne({ username: body.username })
        .lean();
      if (!user) {
        throw new UnauthorizedException("Invalid username or password.");
      }

      const passwordMatch = await bcrypt.compare(
        body.password,
        user.passwordHash,
      );
      if (!passwordMatch) {
        throw new UnauthorizedException("Invalid username or password.");
      }

      const payload = {
        userAgent,
        subId: user._id,
        username: user.username,
        role: "admin",
      };
      const token = await GenerateAuthorizationToken(payload);

      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        data: {
          token: token.generatedXAuthToken,
          expiresAt: token.tokenPayload.interval.expireAt,
        },
      });
    } catch (error: any) {
      throw new ErrorResponseHandlerService(
        false,
        error?.status,
        error?.message,
        {
          ...error,
          details: {
            method: "login",
            service: AuthService.name,
          },
        },
      );
    }
  }

  // async check(): Promise<ResponseHandlerServiceI> {
  //   // try {
  //   //   const user = await this.adminUserModel
  //   //     .findOne({ username: body.username })
  //   //     .lean();
  //   //   if (!user) {
  //   //     throw new UnauthorizedException("Invalid username or password.");
  //   //   }
  //   //   const passwordMatch = await bcrypt.compare(
  //   //     body.password,
  //   //     user.passwordHash,
  //   //   );
  //   //   if (!passwordMatch) {
  //   //     throw new UnauthorizedException("Invalid username or password.");
  //   //   }
  //   //   const payload = {
  //   //     userAgent,
  //   //     subId: user._id,
  //   //     username: user.username,
  //   //     role: "admin",
  //   //   };
  //   //   const token = await GenerateAuthorizationToken(payload);
  //   //   return ResponseHandlerService({
  //   //     success: true,
  //   //     httpCode: HttpStatus.OK,
  //   //     data: {
  //   //       token: token.generatedXAuthToken,
  //   //       expiresAt: token.tokenPayload.interval.expireAt,
  //   //     },
  //   //   });
  //   // } catch (error: any) {
  //   //   throw new ErrorResponseHandlerService(
  //   //     false,
  //   //     error?.status,
  //   //     error?.message,
  //   //     {
  //   //       ...error,
  //   //       details: {
  //   //         method: "login",
  //   //         service: AuthService.name,
  //   //       },
  //   //     },
  //   //   );
  //   // }
  // }

  async seedAdminUser(username: string, password: string): Promise<void> {
    const existing = await this.adminUserModel.findOne({ username });
    if (existing) {
      this.logger.log("Admin user already exists. Skipping seed.");
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await this.adminUserModel.create({ username, passwordHash });
    this.logger.log(`Admin user "${username}" seeded successfully.`);
  }
}
