import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AdminAuthGuard } from "../../common/guards/admin-auth.guard";
import { AddStockDto } from "./dto/add-stock.dto";
import { CreateProductDto } from "./dto/create-product.dto";
import { QueryProductsDto } from "./dto/query-products.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: QueryProductsDto) {
    return this.productsService.findAll(query);
  }

  @Get("filters/options")
  getFilterOptions() {
    return this.productsService.getDistinctFilters();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @UseGuards(AdminAuthGuard)
  create(@Body() body: CreateProductDto) {
    return this.productsService.create(body);
  }

  @Patch(":id")
  @UseGuards(AdminAuthGuard)
  update(@Param("id") id: string, @Body() body: UpdateProductDto) {
    return this.productsService.update(id, body);
  }

  @Patch(":id/stock")
  @UseGuards(AdminAuthGuard)
  addStock(@Param("id") id: string, @Body() body: AddStockDto) {
    return this.productsService.addStock(id, body.amount);
  }

  @Delete(":id")
  @UseGuards(AdminAuthGuard)
  delete(@Param("id") id: string) {
    return this.productsService.delete(id);
  }
}
