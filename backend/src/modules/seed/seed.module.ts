// NestJs Imports
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
// Schemas
import {
  Order,
  Product,
  OrderSchema,
  ProductSchema,
} from "../../common/schemas";
// Modules
import { SeedService } from "./seed.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
    AuthModule,
  ],
  providers: [SeedService],
})
export class SeedModule {}
