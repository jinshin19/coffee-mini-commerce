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
import { CreateOrderDto } from "./dto/create-order.dto";
import { QueryOrdersDto } from "./dto/query-orders.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { OrdersService } from "./orders.service";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(@Query() query: QueryOrdersDto) {
    return this.ordersService.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ordersService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateOrderDto) {
    return this.ordersService.create(body);
  }

  @Patch(":id/confirm")
  @UseGuards(AdminAuthGuard)
  confirm(@Param("id") id: string) {
    return this.ordersService.confirm(id);
  }

  @Patch(":id/reject")
  @UseGuards(AdminAuthGuard)
  reject(@Param("id") id: string) {
    return this.ordersService.reject(id);
  }

  @Patch(":id/status")
  @UseGuards(AdminAuthGuard)
  updateStatus(@Param("id") id: string, @Body() body: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, body);
  }

  @Delete(":id")
  @UseGuards(AdminAuthGuard)
  delete(@Param("id") id: string) {
    return this.ordersService.delete(id);
  }
}
