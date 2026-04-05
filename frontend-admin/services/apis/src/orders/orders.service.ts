const OrderSortC = ["asc", "desc"] as const;
const OrderPaymentMethodC = ["gcash", "cod"] as const;
const OrderStatus = ["all", "pending", "confirmed", "rejected"] as const;

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
    page = 1,
    limit = 5,
    search,
    status,
  }: GetOrdersI): Promise<ResponseHandlerI> {
    const response = await this.apiService.UseApi({
      url: OrderModelsC.getOrders.url,
      method: OrderModelsC.getOrders.method as HTTP_METHOD,
      params: {
        query: {
          page,
          limit,
          search,
          status,
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

  public async getOrderById(id: string): Promise<ResponseHandlerI> {
    const response = await this.apiService.UseApi({
      url: OrderModelsC.getOrderById.url,
      method: OrderModelsC.getOrderById.method as HTTP_METHOD,
      params: { id },
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

  public async confirmOrderById(id: string): Promise<ResponseHandlerI> {
    const response = await this.apiService.UseApi({
      url: OrderModelsC.confirmOrderById.url,
      method: OrderModelsC.confirmOrderById.method as HTTP_METHOD,
      params: { id },
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

  public async deleteOrderById(id: string): Promise<ResponseHandlerI> {
    const response = await this.apiService.UseApi({
      url: OrderModelsC.deleteOrderById.url,
      method: OrderModelsC.deleteOrderById.method as HTTP_METHOD,
      params: { id },
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

  public async rejectOrderById(id: string): Promise<ResponseHandlerI> {
    const response = await this.apiService.UseApi({
      url: OrderModelsC.rejectOrderById.url,
      method: OrderModelsC.rejectOrderById.method as HTTP_METHOD,
      params: { id },
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

  public async updateOrderById(id: string): Promise<ResponseHandlerI> {
    const response = await this.apiService.UseApi({
      url: OrderModelsC.updateOrderById.url,
      method: OrderModelsC.updateOrderById.method as HTTP_METHOD,
      params: { id },
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
  page: number;
  limit: number;
  search?: string;
  status?: string;
}
export interface OrderI {
  _id?: string;
  id: string;
  name: string;
  contactNumber: string;
  address: string;
  paymentMethod: OrderPaymentMethodT;
  proofOfPayment: string | null;
  status: OrderStatusT;
  items: OrderItem[];
  subtotal: number;
  total: number;
  createdAt: string;
}

export interface OrderItem {
  _id?: string;
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export type GetOrdersSortOrderT = (typeof OrderSortC)[number];
export type OrderPaymentMethodT = (typeof OrderPaymentMethodC)[number];
export type OrderStatusT = (typeof OrderStatus)[number];
