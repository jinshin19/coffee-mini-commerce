// NestJs Imports
import {
  Get,
  Body,
  Post,
  Param,
  Query,
  Patch,
  Delete,
  HttpCode,
  Controller,
  HttpStatus,
  UseInterceptors,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
// Decorators
import { HTTPInterceptor } from "@src/common/decorators";
// Modules
import { OrdersService } from "./orders.service";

// DTO's
import { CreateOrderDTO, QueryOrdersDTO, UpdateOrderStatusDTO } from "./dto";
@ApiTags("Orders")
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseInterceptors(HTTPInterceptor)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get all orders" })
  public list(@Query() query: QueryOrdersDTO) {
    return this.ordersService.list(query);
  }

  @Get(":id")
  @UseInterceptors(HTTPInterceptor)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get order by ID" })
  public getById(@Param("id") id: string) {
    return this.ordersService.getById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create an order" })
  create(@Body() body: CreateOrderDTO) {
    console.log("BODY", body);
    return this.ordersService.create(body);
  }

  @Patch(":id/confirm")
  @UseInterceptors(HTTPInterceptor)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Confirm an order by ID" })
  public confirmById(@Param("id") id: string) {
    return this.ordersService.confirmById(id);
  }

  @Patch(":id/reject")
  @UseInterceptors(HTTPInterceptor)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Rejects an order by ID" })
  public rejectById(@Param("id") id: string) {
    return this.ordersService.rejectById(id);
  }

  @Patch(":id/status")
  @UseInterceptors(HTTPInterceptor)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Updates order status by ID" })
  public updateStatusById(
    @Param("id") id: string,
    @Body() body: UpdateOrderStatusDTO,
  ) {
    return this.ordersService.updateStatusById(id, body);
  }

  @Delete(":id")
  @UseInterceptors(HTTPInterceptor)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Deletes an order permanently by ID" })
  public deleteById(@Param("id") id: string) {
    return this.ordersService.deleteById(id);
  }
}
