// NestJs Imports
import { HttpStatus, Injectable } from "@nestjs/common";
// Modules
import { OrdersService } from "../orders/orders.service";
import { ProductsService } from "../products/products.service";
// Services
import {
  ResponseHandlerService,
  ErrorResponseHandlerService,
} from "@src/common/services";
// Interfaces
import { ResponseHandlerServiceI } from "@src/common/interfaces";

@Injectable()
export class DashboardService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
  ) {}

  async getOverview(): Promise<ResponseHandlerServiceI> {
    try {
      const [productPage, orderMetrics] = await Promise.all([
        this.productsService.list({
          page: 1,
          limit: 1000,
          filter: "all",
          sortBy: "updatedAt",
          sortOrder: "desc",
        }),
        this.ordersService.getOrderMetrics(),
      ]);

      const products = productPage.data;

      const data = {
        totalProducts: products?.items?.length,
        lowStockProducts:
          products?.items?.length > 0 &&
          products.items.filter((product) => product.stock <= 10).length,
        outOfStockProducts:
          products?.items?.length > 0 &&
          products.items.filter((product) => product.stock <= 0).length,
        featuredProducts:
          products?.items?.length > 0 &&
          products.items.filter((product) => product.featured).length,
        bestSellerProducts:
          products?.items?.length > 0 &&
          products.items.filter((product) => product.bestSeller).length,
        incomingOrders: orderMetrics?.data?.pendingOrders,
        confirmedOrders: orderMetrics?.data?.confirmedOrders,
        rejectedOrders: orderMetrics?.data?.rejectedOrders,
        totalOrders: orderMetrics?.data?.totalOrders,
        totalSales: orderMetrics?.data?.confirmedRevenue,
      };

      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        data,
      });
    } catch (error: any) {
      throw new ErrorResponseHandlerService(
        false,
        error?.status,
        error?.message,
        {
          ...error,
          details: {
            method: "getOverview",
            service: DashboardService.name,
          },
        },
      );
    }
  }
}
