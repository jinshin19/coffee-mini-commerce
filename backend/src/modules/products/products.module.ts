// NestJs Imports
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
// Modules
import { AuthModule } from "../auth/auth.module";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
// Schemas
import { Product, ProductSchema } from "../../common/schemas";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    AuthModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService, MongooseModule],
})
export class ProductsModule {}
