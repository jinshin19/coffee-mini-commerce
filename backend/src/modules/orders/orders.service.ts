// NestJs Imports
import {
  HttpStatus,
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, SortOrder } from "mongoose";
// Utils
import { PaginationFieldsU } from "@src/common/utils";
import { buildContainsRegex } from "../../common/utils";
// Modules
import { ProductsService } from "../products/products.service";
// Interfaces
import { ResponseHandlerServiceI } from "@src/common/interfaces";
// DTO's
import { CreateOrderDTO, QueryOrdersDTO, UpdateOrderStatusDTO } from "./dto";
// Schemas
import { Order, OrderDocument, OrderItem, Product } from "../../common/schemas";
// Services
import {
  PaginationService,
  ResponseHandlerService,
  ErrorResponseHandlerService,
} from "@src/common/services";

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orders: Model<OrderDocument>,
    private readonly productsService: ProductsService,
  ) {}

  async list(query: QueryOrdersDTO): Promise<ResponseHandlerServiceI> {
    try {
      const page = query.page ?? 1;
      const limit = query.limit ?? 10;

      const filterQuery: FilterQuery<OrderDocument> = {};

      if (query.search?.trim()) {
        const regex = buildContainsRegex(query.search);
        filterQuery.$or = [
          { id: regex },
          { name: regex },
          { contactNumber: regex },
          { address: regex },
          { paymentMethod: regex },
        ];
      }

      if (query.status && query.status !== "all") {
        filterQuery.status = query.status;
      }

      if (query.paymentMethod) {
        filterQuery.paymentMethod = query.paymentMethod;
      }

      if (typeof query.closed === "boolean") {
        filterQuery.status = query.closed
          ? { $in: ["confirmed", "rejected"] }
          : "pending";
      }

      if (query.dateFrom || query.dateTo) {
        filterQuery.createdAt = {};
        if (query.dateFrom) {
          filterQuery.createdAt.$gte = new Date(query.dateFrom);
        }
        if (query.dateTo) {
          filterQuery.createdAt.$lte = new Date(query.dateTo);
        }
      }

      const sortField = query.sortBy || "createdAt";
      const sortOrder: SortOrder = query.sortOrder === "asc" ? 1 : -1;

      const [products, total] = await Promise.all([
        this.orders.aggregate([
          { $match: filterQuery },
          ...PaginationFieldsU(page, limit, sortField, sortOrder),
        ]),
        this.orders.countDocuments(filterQuery),
      ]);

      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        data: PaginationService({
          items: products[0]?.items,
          metadata: {
            ...products[0]?.metadata,
            count: total,
            totalPages: Math.ceil(total / products[0]?.metadata?.limit),
          },
        }),
      });
    } catch (error: any) {
      throw new ErrorResponseHandlerService(
        false,
        error?.status,
        error?.message,
        {
          ...error,
          details: {
            method: "list",
            service: OrdersService.name,
          },
        },
      );
    }
  }

  async getById(id: string): Promise<ResponseHandlerServiceI> {
    try {
      const order = await this.orders.findOne({ _id: id }).lean();

      if (!order) {
        return ResponseHandlerService({
          success: false,
          httpCode: HttpStatus.NOT_FOUND,
          message: `Order ${id} was not found.`,
        });
      }

      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        data: order,
      });
    } catch (error: any) {
      throw new ErrorResponseHandlerService(
        false,
        error?.status,
        error?.message,
        {
          ...error,
          details: {
            method: "getById",
            service: OrdersService.name,
          },
        },
      );
    }
  }

  async create(body: CreateOrderDTO): Promise<ResponseHandlerServiceI> {
    try {
      if (body.paymentMethod === "gcash" && !body.proofOfPayment) {
        return ResponseHandlerService({
          success: false,
          httpCode: HttpStatus.BAD_REQUEST,
          message: "Proof of payment is required for GCash orders.",
        });
      }

      const productsById = await this.resolveProducts(
        body.items.map((item) => item.productId),
      );

      const items: OrderItem[] = body.items.map((item, index) => {
        const product = productsById.get(item.productId);
        if (!product) {
          throw new NotFoundException(
            `Product ${item.productId} was not found.`,
          );
        }
        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Not enough stock for ${product.name}.`,
          );
        }

        return {
          _id: `order-item-${index + 1}-${Math.random().toString(36).slice(2, 6)}`,
          productId: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: item.quantity,
        };
      });

      const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
      const total = subtotal;

      const order = await this.orders.create({
        name: body.name.trim(),
        contactNumber: body.contactNumber.trim(),
        address: body.address.trim(),
        paymentMethod: body.paymentMethod,
        proofOfPayment:
          body.paymentMethod === "gcash"
            ? body.proofOfPayment?.trim() || null
            : null,
        status: "pending",
        items,
        subtotal,
        total,
      });

      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        data: order.toObject(),
      });
    } catch (error: any) {
      throw new ErrorResponseHandlerService(
        false,
        error?.status,
        error?.message,
        {
          ...error,
          details: {
            method: "create",
            service: OrdersService.name,
          },
        },
      );
    }
  }

  async confirmById(id: string): Promise<ResponseHandlerServiceI> {
    try {
      const order = await this.orders.findOne({ _id: id });
      if (!order) {
        throw new NotFoundException(`Order ${id} was not found.`);
      }

      if (order.status !== "pending") {
        return ResponseHandlerService({
          success: false,
          httpCode: HttpStatus.BAD_REQUEST,
          message: "Only pending orders can be confirmed.",
        });
      }

      const uniqueProductIds = [
        ...new Set(order.items.map((item) => item.productId)),
      ];
      const productsById = await this.resolveProducts(uniqueProductIds);

      for (const item of order.items) {
        const product = productsById.get(item.productId);
        if (!product) {
          return ResponseHandlerService({
            success: false,
            httpCode: HttpStatus.NOT_FOUND,
            message: `Product ${item.productId} was not found.`,
          });
        }
        if (product.stock < item.quantity) {
          return ResponseHandlerService({
            success: false,
            httpCode: HttpStatus.BAD_REQUEST,
            message: `Not enough stock to confirm ${order._id}.`,
          });
        }
      }

      for (const item of order.items) {
        await this.productsService.removeStockById(
          item.productId,
          item.quantity,
        );
      }

      order.status = "confirmed";
      await order.save();

      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        data: order.toObject(),
      });
    } catch (error: any) {
      throw new ErrorResponseHandlerService(
        false,
        error?.status,
        error?.message,
        {
          ...error,
          details: {
            method: "confirmById",
            service: OrdersService.name,
          },
        },
      );
    }
  }

  async rejectById(id: string): Promise<ResponseHandlerServiceI> {
    try {
      const order = await this.orders.findOne({ _id: id });

      if (!order) {
        return ResponseHandlerService({
          success: false,
          httpCode: HttpStatus.NOT_FOUND,
          message: `Order ${id} was not found.`,
        });
      }

      if (order.status !== "pending") {
        return ResponseHandlerService({
          success: false,
          httpCode: HttpStatus.BAD_REQUEST,
          message: "Only pending orders can be rejected.",
        });
      }

      order.status = "rejected";
      await order.save();

      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        data: order.toObject(),
      });
    } catch (error: any) {
      throw new ErrorResponseHandlerService(
        false,
        error?.status,
        error?.message,
        {
          ...error,
          details: {
            method: "rejectById",
            service: OrdersService.name,
          },
        },
      );
    }
  }

  async updateStatusById(
    id: string,
    body: UpdateOrderStatusDTO,
  ): Promise<ResponseHandlerServiceI> {
    try {
      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        data:
          body.status === "confirmed"
            ? this.confirmById(id)
            : this.rejectById(id),
      });
    } catch (error: any) {
      throw new ErrorResponseHandlerService(
        false,
        error?.status,
        error?.message,
        {
          ...error,
          details: {
            method: "updateStatusById",
            service: OrdersService.name,
          },
        },
      );
    }
  }

  async deleteById(id: string): Promise<ResponseHandlerServiceI> {
    try {
      const order = await this.orders.findOne({ _id: id });
      if (!order) {
        return ResponseHandlerService({
          success: false,
          httpCode: HttpStatus.NOT_FOUND,
          message: `Order ${id} was not found.`,
        });
      }

      if (order.status === "pending") {
        return ResponseHandlerService({
          success: false,
          httpCode: HttpStatus.BAD_REQUEST,
          message: "Pending orders cannot be deleted. Close them first.",
        });
      }

      await order.deleteOne();

      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        message: `Closed order ${id} deleted successfully.`,
        data: id,
      });
    } catch (error: any) {
      throw new ErrorResponseHandlerService(
        false,
        error?.status,
        error?.message,
        {
          ...error,
          details: {
            method: "deleteById",
            service: OrdersService.name,
          },
        },
      );
    }
  }

  async getOrderMetrics(): Promise<ResponseHandlerServiceI> {
    try {
      const [
        totalOrders,
        pendingOrders,
        confirmedOrders,
        rejectedOrders,
        revenue,
      ] = await Promise.all([
        this.orders.countDocuments(),
        this.orders.countDocuments({ status: "pending" }),
        this.orders.countDocuments({ status: "confirmed" }),
        this.orders.countDocuments({ status: "rejected" }),
        this.orders.aggregate([
          { $match: { status: "confirmed" } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
      ]);

      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        data: {
          totalOrders,
          pendingOrders,
          confirmedOrders,
          rejectedOrders,
          confirmedRevenue: revenue[0]?.total || 0,
        },
      });
    } catch (error: any) {
      throw new ErrorResponseHandlerService(
        false,
        error?.status,
        error?.message,
        {
          ...error,
          details: {
            method: "getOrderMetrics",
            service: OrdersService.name,
          },
        },
      );
    }
  }

  private async resolveProducts(
    productIds: string[],
  ): Promise<Map<string, Product>> {
    try {
      const products = await Promise.all(
        productIds.map((productId) => this.productsService.getById(productId)),
      );
      return new Map(
        products?.length > 0 &&
          products.map((product) => [product.data._id, product.data]),
      );
    } catch (error: any) {
      return error;
    }
  }
}
