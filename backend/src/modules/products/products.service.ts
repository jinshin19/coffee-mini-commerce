// NestJs Imports
import { Model, SortOrder } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable, HttpStatus } from "@nestjs/common";
// Utils
import {
  slugify,
  generateCoffeeId,
  PaginationFieldsU,
  buildContainsRegex,
  buildExactCaseInsensitiveRegex,
} from "../../common/utils";
// Interfaces
import { ResponseHandlerServiceI } from "@src/common/interfaces";
// DTO's
import { CreateProductDTO, QueryProductsDTO, UpdateProductDTO } from "./dto";
// Schemas
import { Product, RoastLevelsT, ProductDocument } from "../../common/schemas";
// Services
import {
  PaginationService,
  ResponseHandlerService,
  ErrorResponseHandlerService,
} from "@src/common/services";

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly products: Model<ProductDocument>,
  ) {}

  async list(query: QueryProductsDTO): Promise<ResponseHandlerServiceI> {
    try {
      const page = query.page ?? 1;
      const limit = query.limit ?? 10;

      let filterQuery: any = {};

      if (query.search?.trim()) {
        const regex = buildContainsRegex(query.search);
        filterQuery.$or = [
          { name: regex },
          { category: regex },
          { origin: regex },
          { roastLevel: regex },
          { slug: regex },
        ];
      }

      if (query.category?.trim()) {
        filterQuery.category = buildExactCaseInsensitiveRegex(query.category);
      }

      if (query.origin?.trim()) {
        filterQuery.origin = buildExactCaseInsensitiveRegex(query.origin);
      }

      if (query.roastLevel?.trim()) {
        filterQuery.roastLevel = buildExactCaseInsensitiveRegex(
          query.roastLevel,
        );
      }

      if (typeof query.featured === "boolean") {
        filterQuery.featured = query.featured;
      }

      if (typeof query.bestSeller === "boolean") {
        filterQuery.bestSeller = query.bestSeller;
      }

      if (query.filter === "featured") {
        filterQuery.featured = true;
      }

      if (query.filter === "bestseller") {
        filterQuery.bestSeller = true;
      }

      if (query.filter === "lowstock" || query.stockStatus === "lowstock") {
        filterQuery.stock = { $lte: 10 };
      }

      if (query.stockStatus === "instock") {
        filterQuery.stock = { $gt: 0 };
      }

      if (query.stockStatus === "outofstock") {
        filterQuery.stock = { $lte: 0 };
      }

      const sortField = query.sortBy || "updatedAt";
      const sortOrder: SortOrder = query.sortOrder === "asc" ? 1 : -1;

      const [products, total] = await Promise.all([
        this.products.aggregate([
          { $match: filterQuery },
          ...PaginationFieldsU(page, limit, sortField, sortOrder),
        ]),
        this.products.countDocuments(filterQuery),
      ]);

      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        data: {
          data: PaginationService({
            items: products[0]?.items,
            metadata: {
              ...products[0]?.metadata,
              count: total,
              totalPages: Math.ceil(total / products[0]?.metadata?.limit),
            },
          }),
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
            method: "list",
            service: ProductsService.name,
          },
        },
      );
    }
  }

  async getById(id: string): Promise<ResponseHandlerServiceI> {
    try {
      const product = await this.products.findOne({ _id: id }).lean();

      if (!product) {
        return ResponseHandlerService({
          success: false,
          httpCode: HttpStatus.NOT_FOUND,
          message: `Product ${id} was not found.`,
        });
      }

      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        data: product,
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
            service: ProductsService.name,
          },
        },
      );
    }
  }

  async create(body: CreateProductDTO): Promise<ResponseHandlerServiceI> {
    try {
      const slug = body.slug?.trim() ? slugify(body.slug) : slugify(body.name);

      await this.ensureSlugAvailable(slug);

      const created = await this.products.create({
        id: generateCoffeeId(),
        slug,
        name: body.name.trim(),
        category: body.category.trim(),
        shortDescription: body.shortDescription.trim(),
        description: body.description.trim(),
        price: body.price,
        image: body.image.trim(),
        roastLevel: body.roastLevel.trim(),
        origin: body.origin.trim(),
        bestSeller: body.bestSeller,
        featured: body.featured,
        stock: body.stock,
      });

      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        data: created.toObject(),
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
            service: ProductsService.name,
          },
        },
      );
    }
  }

  async updateById(
    id: string,
    body: UpdateProductDTO,
  ): Promise<ResponseHandlerServiceI> {
    try {
      const product = await this.products.findOne({ _id: id });
      if (!product) {
        return ResponseHandlerService({
          success: false,
          httpCode: HttpStatus.NOT_FOUND,
          message: `Product ${id} was not found.`,
        });
      }

      if (body.slug || body.name) {
        const nextSlug = body.slug?.trim()
          ? slugify(body.slug)
          : slugify(body.name || product.name);
        await this.ensureSlugAvailable(nextSlug, product._id);
        product.slug = nextSlug;
      }

      if (body.name !== undefined) product.name = body.name.trim();
      if (body.category !== undefined) product.category = body.category.trim();
      if (body.shortDescription !== undefined)
        product.shortDescription = body.shortDescription.trim();
      if (body.description !== undefined)
        product.description = body.description.trim();
      if (body.price !== undefined) product.price = body.price;
      if (body.image !== undefined) product.image = body.image.trim();
      if (body.roastLevel !== undefined)
        product.roastLevel = body.roastLevel.trim() as RoastLevelsT;
      if (body.origin !== undefined) product.origin = body.origin.trim();
      if (body.featured !== undefined) product.featured = body.featured;
      if (body.bestSeller !== undefined) product.bestSeller = body.bestSeller;
      if (body.stock !== undefined) {
        if (body.stock < 0) {
          return ResponseHandlerService({
            success: false,
            httpCode: HttpStatus.BAD_REQUEST,
            message: "Stock cannot be negative.",
          });
        }
        product.stock = body.stock;
      }

      await product.save();

      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        data: product.toObject(),
      });
    } catch (error: any) {
      throw new ErrorResponseHandlerService(
        false,
        error?.status,
        error?.message,
        {
          ...error,
          details: {
            method: "updateById",
            service: ProductsService.name,
          },
        },
      );
    }
  }

  async addStockById(
    id: string,
    amount: number,
  ): Promise<ResponseHandlerServiceI> {
    try {
      if (amount < 1) {
        return ResponseHandlerService({
          success: false,
          httpCode: HttpStatus.BAD_REQUEST,
          message: "Stock amount must be greater than zero.",
        });
      }

      const product = await this.products.findOne({ _id: id });
      if (!product) {
        return ResponseHandlerService({
          success: false,
          httpCode: HttpStatus.NOT_FOUND,
          message: `Product ${id} was not found.`,
        });
      }

      product.stock = product.stock + amount;
      await product.save();

      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        data: product.toObject(),
      });
    } catch (error: any) {
      throw new ErrorResponseHandlerService(
        false,
        error?.status,
        error?.message,
        {
          ...error,
          details: {
            method: "addStockById",
            service: ProductsService.name,
          },
        },
      );
    }
  }

  async removeStockById(
    id: string,
    amount: number,
  ): Promise<ResponseHandlerServiceI> {
    try {
      if (amount < 1) {
        return ResponseHandlerService({
          success: false,
          httpCode: HttpStatus.BAD_REQUEST,
          message: "Stock deduction amount must be greater than zero.",
        });
      }

      const product = await this.products.findOne({ _id: id });
      if (!product) {
        return ResponseHandlerService({
          success: false,
          httpCode: HttpStatus.NOT_FOUND,
          message: `Product ${id} was not found.`,
        });
      }

      if (product.stock < amount) {
        return ResponseHandlerService({
          success: false,
          httpCode: HttpStatus.BAD_REQUEST,
          message: `Not enough stock available for ${product.name}.`,
        });
      }

      product.stock -= amount;
      await product.save();

      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        data: product.toObject(),
      });
    } catch (error: any) {
      throw new ErrorResponseHandlerService(
        false,
        error?.status,
        error?.message,
        {
          ...error,
          details: {
            method: "removeStockById",
            service: ProductsService.name,
          },
        },
      );
    }
  }

  async deleteById(id: string): Promise<ResponseHandlerServiceI> {
    try {
      const deleted = await this.products.findOneAndDelete({ _id: id }).lean();
      if (!deleted) {
        return ResponseHandlerService({
          success: false,
          httpCode: HttpStatus.NOT_FOUND,
          message: `Product ${id} was not found.`,
        });
      }

      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        message: `Product ${id} deleted successfully.`,
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
            service: ProductsService.name,
          },
        },
      );
    }
  }

  async getDistinctFilters(): Promise<ResponseHandlerServiceI> {
    try {
      const [categories, origins, roastLevels] = await Promise.all([
        this.products.distinct("category"),
        this.products.distinct("origin"),
        this.products.distinct("roastLevel"),
      ]);

      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        data: {
          categories: categories.sort(),
          origins: origins.sort(),
          roastLevels: roastLevels.sort(),
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
            method: "getDistinctFilters",
            service: ProductsService.name,
          },
        },
      );
    }
  }

  private async ensureSlugAvailable(
    slug: string,
    excludeId?: string,
  ): Promise<ResponseHandlerServiceI> {
    try {
      const existing = await this.products.findOne({
        slug,
        ...(excludeId ? { _id: { $ne: excludeId } } : {}),
      });

      if (existing) {
        return ResponseHandlerService({
          success: false,
          httpCode: HttpStatus.CONFLICT,
          message: `Slug "${slug}" is already in use.`,
        });
      }

      return ResponseHandlerService({
        success: true,
        httpCode: HttpStatus.OK,
        message: "Slug is available",
      });
    } catch (error: any) {
      throw new ErrorResponseHandlerService(
        false,
        error?.status,
        error?.message,
        {
          ...error,
          details: {
            method: "ensureSlugAvailable",
            service: ProductsService.name,
          },
        },
      );
    }
  }
}
