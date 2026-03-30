// NestJs Imports
import { Controller, Get } from "@nestjs/common";
// Modules
import { HealthService } from "./health.service";

@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}
  @Get()
  check() {
    return this.healthService.check();
  }
}
