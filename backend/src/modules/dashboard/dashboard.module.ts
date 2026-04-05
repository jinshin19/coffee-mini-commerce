// NestJs Imports
import { Module } from "@nestjs/common";
// Modules
import { AuthModule } from "../auth/auth.module";
import { OrdersModule } from "../orders/orders.module";
import { DashboardService } from "./dashboard.service";
import { ProductsModule } from "../products/products.module";
import { DashboardController } from "./dashboard.controller";

@Module({
  imports: [ProductsModule, OrdersModule, AuthModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
