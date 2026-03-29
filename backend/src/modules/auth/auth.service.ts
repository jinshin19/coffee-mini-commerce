import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { Model } from "mongoose";
import { AdminUser, AdminUserDocument } from "./schemas/admin-user.schema";
import { LoginAdminDto } from "./dto/login-admin.dto";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(AdminUser.name)
    private readonly adminUserModel: Model<AdminUserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    body: LoginAdminDto,
  ): Promise<{ token: string; expiresIn: string }> {
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

    const payload = { sub: user._id, username: user.username, role: "admin" };
    const token = this.jwtService.sign(payload);

    return { token, expiresIn: "7d" };
  }

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
