import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthService } from "../auth/auth.service";
import { Order, OrderDocument } from "../orders/schemas/order.schema";
import { Product, ProductDocument } from "../products/schemas/product.schema";
import { seedOrders, seedProducts } from "./seed.data";

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    const [productCount, orderCount] = await Promise.all([
      this.productModel.countDocuments(),
      this.orderModel.countDocuments(),
    ]);

    if (productCount === 0) {
      await this.productModel.insertMany(seedProducts);
      this.logger.log("Seeded initial coffee products.");
    }

    if (orderCount === 0) {
      await this.orderModel.insertMany(seedOrders);
      this.logger.log("Seeded initial coffee orders.");
    }

    const username =
      this.configService.get<string>("ADMIN_USERNAME") || "admin";
    const password =
      this.configService.get<string>("ADMIN_PASSWORD") || "admin123";
    await this.authService.seedAdminUser(username, password);
  }
}
