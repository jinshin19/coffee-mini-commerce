// NestJs Imports
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
// DTO's
import { LoginAdminDTO } from "./dto";
// Modules
import { AuthService } from "./auth.service";
// Decorators
import { HTTPInterceptor } from "@src/common/decorators";

@ApiBearerAuth(process.env.AUTHORIZATION_KEY)
@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Login admin dashboard" })
  public login(
    @Headers("user-agent") userAgent: string,
    @Body() body: LoginAdminDTO,
  ) {
    console.log("HI");
    return this.authService.login(userAgent, body);
  }

  @Post("logout")
  @UseInterceptors(HTTPInterceptor)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Logout admin dashboard" })
  public logout() {
    return { message: "Logged out successfully." };
  }

  @Get("check")
  @UseInterceptors(HTTPInterceptor)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Checks user's authority" })
  public check() {
    // return this.authService.check();
    return { message: "ok" };
  }
}
