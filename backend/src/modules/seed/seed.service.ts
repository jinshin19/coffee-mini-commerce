// NestJs Imports
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
// Modules
import { AuthService } from "../auth/auth.service";
// Seed Datas
import { seedOrders, seedProducts } from "./seed.data";
// Schemas
import {
  Order,
  OrderDocument,
  Product,
  ProductDocument,
} from "../../common/schemas";

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
