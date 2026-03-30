// NestJs Imports
import { Injectable } from "@nestjs/common";

@Injectable()
export class HealthService {
  constructor() {}

  async check(): Promise<{
    message: string;
  }> {
    return {
      message: "I'm healthy!",
    };
  }
}
