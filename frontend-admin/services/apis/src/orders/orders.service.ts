const SortOrdersC = ["asc", "desc"] as const;

// API Service
import { ApiService } from "../api.service";
// Models
import { OrderModelsC } from "@/services/models";
// Next Imports
import { HTTP_METHOD } from "next/dist/server/web/http";
// Service Handlers
import {
  ResponseHandlerI,
  ResponseHandlerService,
  ErrorResponseHandlerService,
} from "@/services/handlers";

export class OrdersService {
  constructor(private readonly apiService: ApiService) {}

  public async getOrders({
    limit,
    sortBy,
    sortOrder,
  }: GetOrdersI): Promise<ResponseHandlerI> {
    const response = await this.apiService.UseApi({
      url: OrderModelsC.getOrders.url,
      method: OrderModelsC.getOrders.method as HTTP_METHOD,
      params: {
        query: {
          limit,
          sortBy,
          sortOrder,
        },
      },
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

export interface GetOrdersI {
  limit: number;
  sortBy: string;
  sortOrder: GetOrdersSortOrderT;
}

export type GetOrdersSortOrderT = (typeof SortOrdersC)[number];
