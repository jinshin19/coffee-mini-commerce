const OrderSortC = ["asc", "desc"] as const;

// API Service
import { ApiService } from "../api.service";
// Models
import { DashboardModelsC, OrderModelsC } from "@/services/models";
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

  public async getOrders({
    page = 1,
    limit = 5,
    sortBy,
    sortOrder,
  }: GetDashboarddOrdersI): Promise<ResponseHandlerI> {
    const response = await this.apiService.UseApi({
      url: OrderModelsC.getOrders.url,
      method: OrderModelsC.getOrders.method as HTTP_METHOD,
      params: {
        query: {
          page,
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

export interface DashboardOverviewI {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  featuredProducts: number;
  bestSellerProducts: number;
  incomingOrders: number;
  confirmedOrders: number;
  rejectedOrders: number;
  totalOrders: number;
  totalSales: number;
}

export interface GetDashboarddOrdersI {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: GetDashboardSortOrderT;
}

export type GetDashboardSortOrderT = (typeof OrderSortC)[number];
