import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginAdminDto } from "./dto/login-admin.dto";

@Controller("admin")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  login(@Body() body: LoginAdminDto) {
    return this.authService.login(body);
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  logout() {
    // Stateless JWT — invalidation is handled client-side by deleting the token.
    return { message: "Logged out successfully." };
  }
}
