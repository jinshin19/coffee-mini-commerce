import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, SortOrder } from "mongoose";
import { buildContainsRegex } from "../../common/utils/query.utils";
import { ProductsService } from "../products/products.service";
import { Product } from "../products/schemas/product.schema";
import { CreateOrderDto } from "./dto/create-order.dto";
import { QueryOrdersDto } from "./dto/query-orders.dto";
import { UpdateOrderStatusDto } from "./dto/update-order-status.dto";
import { Order, OrderDocument, OrderItem } from "./schemas/order.schema";
import { PaginationService } from "src/common/services/pagination.service";
import { PaginationFieldsU } from "src/common/utils/mongodb-modifier.util";
import { ResponseService } from "src/common/interfaces/response.interfaces";

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orders: Model<OrderDocument>,
    private readonly productsService: ProductsService,
  ) {}

  async findAll(query: QueryOrdersDto): Promise<ResponseService> {
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

    return {
      data: PaginationService({
        items: products[0]?.items,
        metadata: {
          ...products[0]?.metadata,
          count: total,
          totalPages: Math.ceil(total / products[0]?.metadata?.limit),
        },
      }),
    };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orders.findOne({ _id: id }).lean();
    if (!order) {
      throw new NotFoundException(`Order ${id} was not found.`);
    }
    return order;
  }

  async create(body: CreateOrderDto): Promise<Order> {
    if (body.paymentMethod === "gcash" && !body.proofOfPayment) {
      throw new BadRequestException(
        "Proof of payment is required for GCash orders.",
      );
    }

    const productsById = await this.resolveProducts(
      body.items.map((item) => item.productId),
    );

    const items: OrderItem[] = body.items.map((item, index) => {
      const product = productsById.get(item.productId);
      if (!product) {
        throw new NotFoundException(`Product ${item.productId} was not found.`);
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Not enough stock for ${product.name}.`);
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

    console.log("ORDER", order);

    return order.toObject();
  }

  async confirm(id: string): Promise<Order> {
    const order = await this.orders.findOne({ _id: id });
    if (!order) {
      throw new NotFoundException(`Order ${id} was not found.`);
    }

    if (order.status !== "pending") {
      throw new ConflictException("Only pending orders can be confirmed.");
    }

    const uniqueProductIds = [
      ...new Set(order.items.map((item) => item.productId)),
    ];
    const productsById = await this.resolveProducts(uniqueProductIds);

    for (const item of order.items) {
      const product = productsById.get(item.productId);
      if (!product) {
        throw new NotFoundException(`Product ${item.productId} was not found.`);
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Not enough stock to confirm ${order._id}.`,
        );
      }
    }

    for (const item of order.items) {
      await this.productsService.removeStock(item.productId, item.quantity);
    }

    order.status = "confirmed";
    await order.save();

    return order.toObject();
  }

  async reject(id: string): Promise<Order> {
    const order = await this.orders.findOne({ _id: id });
    if (!order) {
      throw new NotFoundException(`Order ${id} was not found.`);
    }

    if (order.status !== "pending") {
      throw new ConflictException("Only pending orders can be rejected.");
    }

    order.status = "rejected";
    await order.save();

    return order.toObject();
  }

  async updateStatus(id: string, body: UpdateOrderStatusDto): Promise<Order> {
    return body.status === "confirmed" ? this.confirm(id) : this.reject(id);
  }

  async delete(id: string) {
    const order = await this.orders.findOne({ _id: id });
    if (!order) {
      throw new NotFoundException(`Order ${id} was not found.`);
    }

    if (order.status === "pending") {
      throw new ConflictException(
        "Pending orders cannot be deleted. Close them first.",
      );
    }

    await order.deleteOne();

    return {
      message: `Closed order ${id} deleted successfully.`,
      id,
    };
  }

  async getOrderMetrics() {
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

    return {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      rejectedOrders,
      confirmedRevenue: revenue[0]?.total || 0,
    };
  }

  private async resolveProducts(
    productIds: string[],
  ): Promise<Map<string, Product>> {
    const products = await Promise.all(
      productIds.map((productId) => this.productsService.findOne(productId)),
    );
    return new Map(products.map((product) => [product._id, product]));
  }
}
