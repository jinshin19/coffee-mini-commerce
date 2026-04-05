// API Service
import { ApiService } from "../api.service";
// Models
import { AuthModelsC } from "@/services/models";
// Next Imports
import { HTTP_METHOD } from "next/dist/server/web/http";
// Service Handlers
import {
  ResponseHandlerI,
  ResponseHandlerService,
  ErrorResponseHandlerService,
} from "@/services/handlers";

export class AuthService {
  constructor(private readonly apiService: ApiService) {}

  public async login({
    username,
    password,
  }: LoginI): Promise<ResponseHandlerI> {
    const response = await this.apiService.UseApi<LoginI>({
      url: AuthModelsC.login.url,
      method: AuthModelsC.login.method as HTTP_METHOD,
      body: { username, password },
    });

    if (response instanceof ErrorResponseHandlerService) {
      return ResponseHandlerService({
        success: false,
        httpCode: response.status,
        message: response.message,
        error: {
          url: response.url,
          method: response.method,
        },
      });
    }

    return ResponseHandlerService(await response);
  }

  public async check(): Promise<ResponseHandlerI> {
    const response = await this.apiService.UseApi<LoginI>({
      url: AuthModelsC.check.url,
      method: AuthModelsC.check.method as HTTP_METHOD,
    });

    if (response instanceof ErrorResponseHandlerService) {
      return ResponseHandlerService({
        success: false,
        httpCode: response.status,
        message: response.message,
        error: {
          url: response.url,
          method: response.method,
        },
      });
    }

    return ResponseHandlerService(await response);
  }
}

interface LoginI {
  username: string;
  password: string;
}
