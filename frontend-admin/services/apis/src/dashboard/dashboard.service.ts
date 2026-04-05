// API Service
import { ApiService } from "../api.service";
// Models
import { DashboardModelsC } from "@/services/models";
// Next Imports
import { HTTP_METHOD } from "next/dist/server/web/http";
// Service Handlers
import {
  ResponseHandlerI,
  ResponseHandlerService,
  ErrorResponseHandlerService,
} from "@/services/handlers";

export class DashboardService {
  constructor(private readonly apiService: ApiService) {}

  public async getOverview(): Promise<ResponseHandlerI> {
    let token: string | null = null;

    if (typeof window !== "undefined") {
      token = localStorage.getItem(process.env.NEXT_PUBLIC_ST_KEY!);
    }

    const response = await this.apiService.UseApi({
      url: DashboardModelsC.getOverview.url,
      method: DashboardModelsC.getOverview.method as HTTP_METHOD,
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
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
