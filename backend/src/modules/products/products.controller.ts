// NestJs Imports
import {
  Get,
  Body,
  Post,
  Param,
  Patch,
  Query,
  Delete,
  HttpCode,
  HttpStatus,
  Controller,
  UseInterceptors,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
// DTO's
import {
  AddStockDTO,
  CreateProductDTO,
  QueryProductsDTO,
  UpdateProductDTO,
} from "./dto";
// Modules
import { ProductsService } from "./products.service";
// Decorators
import { HTTPInterceptor } from "@src/common/decorators";
// Auth Guards

@ApiTags("Products")
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all products" })
  public list(@Query() query: QueryProductsDTO) {
    return this.productsService.list(query);
  }

  @Get("filters/options")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get products by filter" })
  public getFilterOptions() {
    return this.productsService.getDistinctFilters();
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get product by ID" })
  public getById(@Param("id") id: string) {
    return this.productsService.getById(id);
  }

  @Post()
  @UseInterceptors(HTTPInterceptor)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a product" })
  public create(@Body() body: CreateProductDTO) {
    return this.productsService.create(body);
  }

  @Patch(":id")
  @UseInterceptors(HTTPInterceptor)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Update a product by ID" })
  public updateById(@Param("id") id: string, @Body() body: UpdateProductDTO) {
    return this.productsService.updateById(id, body);
  }

  @Patch(":id/stock")
  @UseInterceptors(HTTPInterceptor)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Restock product by ID" })
  public addStockById(@Param("id") id: string, @Body() body: AddStockDTO) {
    return this.productsService.addStockById(id, body.amount);
  }

  @Delete(":id")
  @UseInterceptors(HTTPInterceptor)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Deletes product permanently by ID" })
  public deleteById(@Param("id") id: string) {
    return this.productsService.deleteById(id);
  }
}
