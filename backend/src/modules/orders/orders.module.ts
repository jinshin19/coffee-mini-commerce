// NestJs Imports
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
// Schemas
import { Order, OrderSchema } from "../../common/schemas";
// Modules
import { AuthModule } from "../auth/auth.module";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { ProductsModule } from "../products/products.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ProductsModule,
    AuthModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService, MongooseModule],
})
export class OrdersModule {}
