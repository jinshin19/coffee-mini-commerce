// NestJs Imports
import {
  Get,
  HttpCode,
  Controller,
  HttpStatus,
  UseInterceptors,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
// Modules
import { DashboardService } from "./dashboard.service";
// Decorators
import { HTTPInterceptor } from "@src/common/decorators";

@ApiTags("Dashboard")
@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("overview")
  @UseInterceptors(HTTPInterceptor)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get dashboard overviews" })
  public getOverview() {
    return this.dashboardService.getOverview();
  }
}
