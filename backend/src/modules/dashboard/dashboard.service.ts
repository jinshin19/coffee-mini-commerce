import { Injectable } from "@nestjs/common";
import { OrdersService } from "../orders/orders.service";
import { ProductsService } from "../products/products.service";

@Injectable()
export class DashboardService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
  ) {}

  async getOverview() {
    const [productPage, orderMetrics] = await Promise.all([
      this.productsService.findAll({
        page: 1,
        limit: 1000,
        filter: "all",
        sortBy: "updatedAt",
        sortOrder: "desc",
      }),
      this.ordersService.getOrderMetrics(),
    ]);

    const products = productPage.data;

    return {
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
      incomingOrders: orderMetrics.pendingOrders,
      confirmedOrders: orderMetrics.confirmedOrders,
      rejectedOrders: orderMetrics.rejectedOrders,
      totalOrders: orderMetrics.totalOrders,
      totalSales: orderMetrics.confirmedRevenue,
    };
  }
}
