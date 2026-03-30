// NestJs Imports
import { Module } from "@nestjs/common";
// Modules
import { HealthService } from "./health.service";
import { HealthController } from "./health.controller";

@Module({
  imports: [],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
