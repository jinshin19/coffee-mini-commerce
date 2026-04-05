// Modules`
import { HealthService } from "./health.service";
// NestJs Imports
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
@ApiTags("Backend Health")
@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Checks backend health" })
  public check() {
    return this.healthService.check();
  }
}
