// NestJs Imports
import { Module } from "@nestjs/common";
// Modules
import { UploadsController } from "./uploads.controller";

@Module({
  controllers: [UploadsController],
})
export class UploadsModule {}
